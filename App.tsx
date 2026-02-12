import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { createTrace, initStorage, listTraces, type Trace } from "./src/data/storage";
import {
  getNextPhaseOnArm,
  getNextPhaseOnHoldCancel,
  getNextPhaseOnHoldStart,
  getReleaseHint,
  type RitualPhase,
} from "./src/features/ritual/state";
import { tokens } from "./src/theme/tokens";
import { formatTraceDateTime, formatTraceTime } from "./src/utils/format";

const HOLD_SIZE = 152;

export default function App() {
  const [phase, setPhase] = useState<RitualPhase>("idle");
  const [inputText, setInputText] = useState("");
  const [traces, setTraces] = useState<Trace[]>([]);
  const [isTracesOpen, setIsTracesOpen] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [isStorageReady, setIsStorageReady] = useState(false);

  const holdProgress = useSharedValue(0);
  const releasedOpacity = useSharedValue(0);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReleasingRef = useRef(false);

  const hasInput = inputText.trim().length > 0;

  const progressStyle = useAnimatedStyle(() => ({
    width: HOLD_SIZE * holdProgress.value,
  }));

  const releasedStyle = useAnimatedStyle(() => ({
    opacity: releasedOpacity.value,
  }));

  const loadTraces = async () => {
    const items = await listTraces();
    setTraces(items);
  };

  const handleInit = async () => {
    await initStorage();
    await loadTraces();
    setIsStorageReady(true);
  };

  useEffect(() => {
    handleInit().catch((error: unknown) => {
      console.error("Storage init failed", error);
    });
    return () => {
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hasInput && phase === "idle") return;
    if (!hasInput && phase !== "released") {
      setPhase("idle");
    }
  }, [hasInput, phase]);

  const releaseHint = useMemo(() => getReleaseHint(phase), [phase]);

  const finishRelease = async () => {
    if (isReleasingRef.current) return;
    isReleasingRef.current = true;
    await createTrace(inputText);
    await loadTraces();
    setInputText("");
    setPhase("released");
    releasedOpacity.value = 0;
    releasedOpacity.value = withTiming(1, {
      duration: tokens.motion.releaseFadeMs,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
      return;
    });
    releaseTimerRef.current = setTimeout(() => {
      setPhase("idle");
      isReleasingRef.current = false;
      holdProgress.value = 0;
      releasedOpacity.value = 0;
    }, tokens.motion.releasedStateMs);
  };

  const armRelease = () => {
    setPhase((current) => getNextPhaseOnArm(current, hasInput));
  };

  const onHoldStart = () => {
    const next = getNextPhaseOnHoldStart(phase);
    if (next !== "holding") return;
    setPhase(next);
    holdProgress.value = 0;
    holdProgress.value = withTiming(1, { duration: tokens.motion.holdMs }, (finished) => {
      if (finished) runOnJS(finishRelease)();
    });
  };

  const onHoldEnd = () => {
    const next = getNextPhaseOnHoldCancel(phase, isReleasingRef.current);
    if (next === phase) return;
    cancelAnimation(holdProgress);
    holdProgress.value = withTiming(0, { duration: 160 });
    setPhase(next);
  };

  const openTraces = async () => {
    await loadTraces();
    setIsTracesOpen(true);
  };

  const closeTraces = () => {
    setIsTracesOpen(false);
    setSelectedTrace(null);
  };

  const returnToNow = () => {
    if (!selectedTrace) return;
    setInputText(selectedTrace.text);
    setSelectedTrace(null);
    setIsTracesOpen(false);
    setPhase("idle");
  };

  const isReleaseButtonVisible = hasInput && phase !== "released";
  const isHoldVisible = phase === "armed" || phase === "holding";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <Text style={styles.time}>{isStorageReady ? "9:41" : "Loading..."}</Text>

        <View style={[styles.editorCard, phase === "released" && styles.editorCardReleased]}>
          {phase !== "released" ? (
            <TextInput
              multiline
              placeholder="Something you left behind"
              placeholderTextColor={tokens.color.textGhost}
              value={inputText}
              onChangeText={setInputText}
              style={styles.input}
              textAlignVertical="top"
            />
          ) : (
            <Animated.View style={[styles.releasedWrap, releasedStyle]}>
              <Text style={styles.releasedTitle}>Released</Text>
              <Text style={styles.releasedSubtitle}>and left in gentle air.</Text>
            </Animated.View>
          )}
        </View>

        <Text style={styles.hint}>{releaseHint}</Text>

        <Pressable onPress={openTraces}>
          <Text style={styles.tracesLink}>TRACES</Text>
        </Pressable>

        {isReleaseButtonVisible && !isHoldVisible && (
          <Pressable style={styles.releaseButton} onPress={armRelease}>
            <Text style={styles.releaseButtonText}>Release</Text>
          </Pressable>
        )}

        {isHoldVisible && (
          <Pressable onPressIn={onHoldStart} onPressOut={onHoldEnd} style={styles.holdWrap}>
            <View style={styles.holdOuter}>
              <Animated.View style={[styles.holdProgress, progressStyle]} />
              <View style={styles.holdInner}>
                <Text style={styles.holdLabel}>HOLDING</Text>
                <Text style={styles.holdSub}>to release</Text>
              </View>
            </View>
          </Pressable>
        )}
      </View>

      <Modal visible={isTracesOpen} transparent animationType="slide" onRequestClose={closeTraces}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalTapZone} onPress={closeTraces} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>TRACES</Text>
            <FlatList
              data={traces}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Pressable style={styles.traceRow} onPress={() => setSelectedTrace(item)}>
                  <Text style={styles.tracePreview}>{item.preview}</Text>
                  <Text style={styles.traceTime}>{formatTraceTime(item.createdAt)}</Text>
                </Pressable>
              )}
              ListEmptyComponent={<Text style={styles.empty}>No traces yet.</Text>}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={Boolean(selectedTrace)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTrace(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalTapZone} onPress={() => setSelectedTrace(null)} />
          <View style={styles.detailCard}>
            {selectedTrace && (
              <>
                <Text style={styles.detailDate}>{formatTraceDateTime(selectedTrace.createdAt)}</Text>
                <Text style={styles.detailText}>{selectedTrace.text}</Text>
                <Pressable onPress={returnToNow}>
                  <Text style={styles.returnToNow}>RETURN TO NOW</Text>
                </Pressable>
                <Pressable onPress={() => setSelectedTrace(null)} style={styles.closePill}>
                  <Text style={styles.closePillText}>CLOSE</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    alignItems: "center",
    gap: 18,
  },
  time: {
    alignSelf: "flex-start",
    color: tokens.color.textGhost,
    fontSize: 14,
    letterSpacing: 0.4,
  },
  editorCard: {
    width: "100%",
    flex: 1,
    maxHeight: 430,
    borderRadius: tokens.radius.card,
    backgroundColor: tokens.color.surface,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: 24,
    paddingVertical: 28,
    justifyContent: "flex-start",
  },
  editorCardReleased: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: tokens.color.text,
    fontSize: tokens.typography.body,
    lineHeight: 42,
    fontStyle: "italic",
  },
  releasedWrap: {
    alignItems: "center",
    gap: 8,
  },
  releasedTitle: {
    color: tokens.color.accent,
    fontSize: tokens.typography.hero,
    fontWeight: "300",
    letterSpacing: 0.6,
  },
  releasedSubtitle: {
    color: tokens.color.textFaint,
    fontSize: tokens.typography.body,
    fontStyle: "italic",
  },
  hint: {
    color: tokens.color.textGhost,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  tracesLink: {
    color: tokens.color.accent,
    fontSize: tokens.typography.meta,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  releaseButton: {
    minWidth: 136,
    backgroundColor: tokens.color.buttonBg,
    borderRadius: tokens.radius.button,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  releaseButtonText: {
    color: tokens.color.text,
    textAlign: "center",
    fontSize: 29,
    fontStyle: "italic",
    fontWeight: "300",
  },
  holdWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  holdOuter: {
    width: HOLD_SIZE,
    height: HOLD_SIZE,
    borderRadius: tokens.radius.pill,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: tokens.color.surface,
  },
  holdProgress: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#D6E2E3",
  },
  holdInner: {
    width: HOLD_SIZE - 30,
    height: HOLD_SIZE - 30,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  holdLabel: {
    color: "#F2F6F5",
    fontWeight: "700",
    letterSpacing: 1.2,
    fontSize: 12,
  },
  holdSub: {
    color: "#E9F3F2",
    fontSize: 28,
    fontWeight: "300",
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: tokens.color.overlay,
    justifyContent: "flex-end",
  },
  modalTapZone: {
    flex: 1,
  },
  sheet: {
    backgroundColor: tokens.color.surface,
    borderTopLeftRadius: tokens.radius.sheet,
    borderTopRightRadius: tokens.radius.sheet,
    paddingTop: 10,
    paddingBottom: 18,
    minHeight: "52%",
    borderTopWidth: 1,
    borderColor: tokens.color.border,
  },
  sheetHandle: {
    width: 56,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#D1D8D7",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    color: tokens.color.textGhost,
    letterSpacing: 2.4,
    fontSize: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 18,
  },
  traceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
  },
  tracePreview: {
    flex: 1,
    color: tokens.color.textFaint,
    fontSize: 35,
    lineHeight: 52,
    fontStyle: "italic",
    fontWeight: "300",
  },
  traceTime: {
    color: tokens.color.textGhost,
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 12,
    textTransform: "uppercase",
  },
  empty: {
    color: tokens.color.textGhost,
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
  },
  detailCard: {
    marginHorizontal: 18,
    marginBottom: 18,
    backgroundColor: tokens.color.surface,
    borderRadius: tokens.radius.sheet,
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: tokens.color.border,
    gap: 18,
  },
  detailDate: {
    color: tokens.color.textGhost,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  detailText: {
    color: tokens.color.text,
    fontSize: 47,
    lineHeight: 66,
    fontStyle: "italic",
    fontWeight: "300",
  },
  returnToNow: {
    color: tokens.color.accent,
    textAlign: "center",
    letterSpacing: 1.6,
    fontWeight: "700",
    fontSize: 17,
    marginTop: 4,
  },
  closePill: {
    alignSelf: "center",
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: 24,
    paddingVertical: 9,
  },
  closePillText: {
    color: tokens.color.textGhost,
    letterSpacing: 1.3,
    fontSize: 12,
  },
});
