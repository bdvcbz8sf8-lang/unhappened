import { Pressable, StyleSheet, Text, View } from "react-native";
import { tokens } from "../../../theme/tokens";

type IntroScreenProps = {
  onContinue: () => void;
};

export function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <Text style={styles.brand}>Unhappened</Text>
        <View style={styles.separator} />
        <Text style={styles.headline}>Not everything{"\n"}has to be done.</Text>
        <View style={styles.separator} />
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
    backgroundColor: tokens.color.bg,
    paddingHorizontal: 28,
    paddingBottom: 48,
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    marginTop: "40%",
    alignItems: "center",
    gap: 24,
  },
  brand: {
    color: tokens.color.accent,
    fontSize: 40,
    fontStyle: "italic",
    fontWeight: "300",
  },
  separator: {
    width: 82,
    height: 1,
    backgroundColor: tokens.color.border,
  },
  headline: {
    color: tokens.color.text,
    fontSize: 58,
    lineHeight: 82,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "300",
  },
  ctaWrap: {
    alignItems: "center",
    gap: 12,
  },
  ctaLabel: {
    color: tokens.color.textGhost,
    fontSize: 12,
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  ctaCircle: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaArrow: {
    color: tokens.color.textGhost,
    fontSize: 20,
    marginTop: -3,
  },
});
