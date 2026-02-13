import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import type { RitualPhase } from "../state";
import { tokens } from "../../../theme/tokens";

const HOLD_SIZE = 152;

type RitualScreenProps = {
  phase: RitualPhase;
  isStorageReady: boolean;
  inputText: string;
  releaseHint: string;
  holdProgress: SharedValue<number>;
  releasedOpacity: SharedValue<number>;
  onChangeText: (next: string) => void;
  onOpenTraces: () => void;
  onArmRelease: () => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
};

export function RitualScreen({
  phase,
  isStorageReady,
  inputText,
  releaseHint,
  holdProgress,
  releasedOpacity,
  onChangeText,
  onOpenTraces,
  onArmRelease,
  onHoldStart,
  onHoldEnd,
}: RitualScreenProps) {
  const hasInput = inputText.trim().length > 0;
  const isReleaseButtonVisible = hasInput && phase !== "released";
  const isHoldVisible = phase === "armed" || phase === "holding";

  const progressStyle = useAnimatedStyle(() => ({
    width: HOLD_SIZE * holdProgress.value,
  }));
  const releasedStyle = useAnimatedStyle(() => ({
    opacity: releasedOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <Text style={styles.time}>{isStorageReady ? "9:41" : "Loading..."}</Text>

        <View style={[styles.editorCard, phase === "released" && styles.editorCardReleased]}>
          {phase !== "released" ? (
            <TextInput
              multiline
              placeholder="Something you left behind"
              placeholderTextColor="rgba(30, 27, 22, 0.4)"
              value={inputText}
              onChangeText={onChangeText}
              style={styles.input}
              textAlignVertical="top"
            />
          ) : (
            <Animated.View style={[styles.releasedWrap, releasedStyle]}>
              <Text style={styles.releasedTitle}>Released</Text>
              <Text style={styles.releasedSubtitle}>and left in gentle air.</Text>
              <Text style={styles.releasedBreathing}>BREATHING ROOM</Text>
            </Animated.View>
          )}
        </View>

        <Text style={styles.hint}>{releaseHint}</Text>

        <Pressable onPress={onOpenTraces}>
          <Text style={styles.tracesLink}>TRACES</Text>
        </Pressable>

        {isReleaseButtonVisible && !isHoldVisible && (
          <Pressable style={styles.releaseButton} onPress={onArmRelease}>
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
            <Text style={styles.holdingFooter}>LETTING GO...</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  screen: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    alignItems: "center",
    gap: 16,
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
    maxHeight: 450,
    borderRadius: tokens.radius.card,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    paddingHorizontal: 24,
    paddingVertical: 28,
    justifyContent: "flex-start",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.9,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  editorCardReleased: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "#1E1B16",
    fontFamily: "Spectral_300Light_Italic",
    fontSize: 24,
    lineHeight: 34,
    fontStyle: "italic",
    fontWeight: "300",
  },
  releasedWrap: {
    alignItems: "center",
    gap: 8,
  },
  releasedTitle: {
    color: tokens.color.accent,
    fontSize: 56,
    fontWeight: "300",
    letterSpacing: 0.6,
  },
  releasedSubtitle: {
    color: tokens.color.textFaint,
    fontSize: 22,
    fontStyle: "italic",
  },
  releasedBreathing: {
    color: tokens.color.textGhost,
    fontSize: 11,
    letterSpacing: 2.8,
    marginTop: 28,
  },
  hint: {
    color: "rgba(30, 27, 22, 0.2)",
    fontFamily: "Inter_300Light",
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  tracesLink: {
    color: "rgba(30, 27, 22, 0.4)",
    fontFamily: "Inter_300Light",
    fontSize: 14,
    letterSpacing: 1.4,
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
    fontSize: 22,
    fontStyle: "italic",
    fontWeight: "300",
  },
  holdWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
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
    fontSize: 24,
    fontWeight: "300",
    fontStyle: "italic",
  },
  holdingFooter: {
    color: tokens.color.textGhost,
    fontSize: 11,
    letterSpacing: 2.6,
    textTransform: "uppercase",
  },
});
