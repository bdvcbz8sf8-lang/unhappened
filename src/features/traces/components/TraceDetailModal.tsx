import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { Trace } from "../../../data/storage";
import { tokens } from "../../../theme/tokens";
import { formatTraceDateTime } from "../../../utils/format";

type TraceDetailModalProps = {
  trace: Trace | null;
  onClose: () => void;
  onReturnToNow: (trace: Trace) => void;
};

export function TraceDetailModal({ trace, onClose, onReturnToNow }: TraceDetailModalProps) {
  return (
    <Modal visible={Boolean(trace)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalTapZone} onPress={onClose} />
        <View style={styles.detailCard}>
          {trace && (
            <>
              <Text style={styles.detailDate}>{formatTraceDateTime(trace.createdAt)}</Text>
              <Text style={styles.detailText}>{trace.text}</Text>
              <Pressable onPress={() => onReturnToNow(trace)}>
                <Text style={styles.returnToNow}>RETURN TO NOW</Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.closePill}>
                <Text style={styles.closePillText}>CLOSE</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: tokens.color.overlay,
    justifyContent: "flex-end",
  },
  modalTapZone: {
    flex: 1,
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
