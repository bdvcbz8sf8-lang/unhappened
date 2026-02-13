import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import {
  cancelAnimation,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { createTrace, initStorage, listTraces, type Trace } from "./src/data/storage";
import { IntroScreen } from "./src/features/intro/components/IntroScreen";
import { RitualScreen } from "./src/features/ritual/components/RitualScreen";
import {
  getNextPhaseOnArm,
  getNextPhaseOnHoldCancel,
  getNextPhaseOnHoldStart,
  getReleaseHint,
  type RitualPhase,
} from "./src/features/ritual/state";
import { TraceDetailModal } from "./src/features/traces/components/TraceDetailModal";
import { TracesSheet } from "./src/features/traces/components/TracesSheet";
import { tokens } from "./src/theme/tokens";

export default function App() {
  const [phase, setPhase] = useState<RitualPhase>("idle");
  const [inputText, setInputText] = useState("");
  const [traces, setTraces] = useState<Trace[]>([]);
  const [isTracesOpen, setIsTracesOpen] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const holdProgress = useSharedValue(0);
  const releasedOpacity = useSharedValue(0);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReleasingRef = useRef(false);

  const hasInput = inputText.trim().length > 0;

  const loadTraces = async () => {
    const items = await listTraces();
    setTraces(items);
  };

  useEffect(() => {
    const handleInit = async () => {
      await initStorage();
      await loadTraces();
      setIsStorageReady(true);
    };
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
    setSelectedTrace(null);
    setIsTracesOpen(true);
  };

  const closeTraces = () => {
    setIsTracesOpen(false);
  };

  const openTraceDetail = (trace: Trace) => {
    setIsTracesOpen(false);
    setSelectedTrace(trace);
  };

  const returnToNow = (trace: Trace) => {
    setInputText(trace.text);
    setSelectedTrace(null);
    setIsTracesOpen(false);
    setPhase("idle");
  };

  const handleContinueFromIntro = () => {
    setShowIntro(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      {showIntro ? (
        <IntroScreen onContinue={handleContinueFromIntro} />
      ) : (
        <RitualScreen
          phase={phase}
          isStorageReady={isStorageReady}
          inputText={inputText}
          releaseHint={releaseHint}
          holdProgress={holdProgress}
          releasedOpacity={releasedOpacity}
          onChangeText={setInputText}
          onOpenTraces={openTraces}
          onArmRelease={armRelease}
          onHoldStart={onHoldStart}
          onHoldEnd={onHoldEnd}
        />
      )}

      <TracesSheet
        visible={isTracesOpen}
        traces={traces}
        onClose={closeTraces}
        onSelectTrace={openTraceDetail}
      />

      <TraceDetailModal
        trace={selectedTrace}
        onClose={() => setSelectedTrace(null)}
        onReturnToNow={returnToNow}
      />
    </View>
  );
}
