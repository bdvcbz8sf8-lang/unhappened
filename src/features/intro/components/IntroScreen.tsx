import { Pressable, StyleSheet, Text, View } from "react-native";
import { tokens } from "../../../theme/tokens";

type IntroScreenProps = {
  onContinue: () => void;
};

export function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <View style={styles.root}>
      <View style={styles.ambientCircle} />

      <View style={styles.centerWrap}>
        <View style={styles.center}>
          <Text style={styles.brand}>Unhappened</Text>
          <View style={styles.separator} />
          <Text style={styles.headline}>
            Not everything{"\n"}has to be <Text style={styles.doneAccent}>done.</Text>
          </Text>
          <View style={styles.separator} />
        </View>
      </View>

      <Pressable onPress={onContinue} style={styles.ctaWrap}>
        <Text style={styles.ctaLabel}>LET GO</Text>
        <View style={styles.ctaCircle}>
          <Text style={styles.ctaArrow}>⌄</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 48,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  centerWrap: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  ambientCircle: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: "rgba(30, 27, 22, 0.02)",
    top: 120,
    right: -170,
  },
  center: {
    alignItems: "center",
    gap: 26,
  },
  brand: {
    color: "#8AA6A6",
    fontFamily: "LaBelleAurore_400Regular",
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  separator: {
    width: 66,
    height: 1,
    backgroundColor: "rgba(138, 166, 166, 0.25)",
  },
  headline: {
    color: "#1E1B16",
    fontFamily: "Spectral_300Light_Italic",
    fontSize: 32,
    lineHeight: 45,
    textAlign: "center",
    opacity: 0.9,
    maxWidth: 332,
  },
  doneAccent: {
    color: "#8AA6A6",
  },
  ctaWrap: {
    alignItems: "center",
    gap: 14,
    marginBottom: 88,
  },
  ctaLabel: {
    color: "#1E1B16",
    fontFamily: "Inter_300Light",
    fontSize: 12,
    opacity: 0.5,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  ctaCircle: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: "rgba(30, 27, 22, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaArrow: {
    color: "rgba(30, 27, 22, 0.65)",
    fontSize: 22,
    marginTop: -3,
  },
});
