import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Trace } from "../../../data/storage";
import { tokens } from "../../../theme/tokens";

type TraceDetailModalProps = {
  trace: Trace | null;
  onClose: () => void;
  onReturnToNow: (trace: Trace) => void;
};

function formatHeaderParts(iso: string): { date: string; time: string } {
  const value = new Date(iso);
  const date = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
  return { date, time };
}

export function TraceDetailModal({ trace, onClose, onReturnToNow }: TraceDetailModalProps) {
  const header = trace ? formatHeaderParts(trace.createdAt) : null;

  return (
    <Modal visible={Boolean(trace)} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalTapZone} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          {trace && header && (
            <>
              <View style={styles.headerRow}>
                <Text style={styles.dateLabel}>{header.date}</Text>
                <Text style={styles.timeLabel}>{header.time}</Text>
              </View>

              <ScrollView
                style={styles.bodyScroll}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.detailText}>{trace.text}</Text>
              </ScrollView>

              <Pressable onPress={() => onReturnToNow(trace)} style={styles.returnRow}>
                <Text style={styles.returnIcon}>↗</Text>
                <Text style={styles.returnToNow}>RETURN TO NOW</Text>
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
  sheet: {
    backgroundColor: tokens.color.surface,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: tokens.color.border,
    minHeight: "86%",
    maxHeight: "92%",
    position: "relative",
  },
  sheetHandle: {
    width: 56,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#D1D8D7",
    alignSelf: "center",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 26,
    marginBottom: 14,
  },
  dateLabel: {
    color: tokens.color.textGhost,
    fontSize: 11,
    letterSpacing: 2.1,
    textTransform: "uppercase",
  },
  timeLabel: {
    color: tokens.color.textGhost,
    fontSize: 11,
    letterSpacing: 2.1,
    textTransform: "uppercase",
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 26,
    paddingBottom: 110,
  },
  detailText: {
    color: tokens.color.text,
    fontSize: 21,
    lineHeight: 41,
    fontStyle: "italic",
    fontWeight: "300",
    marginBottom: 34,
  },
  returnRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  returnIcon: {
    color: tokens.color.accent,
    fontSize: 20,
  },
  returnToNow: {
    color: tokens.color.accent,
    textAlign: "center",
    letterSpacing: 1.6,
    fontWeight: "700",
    fontSize: 17,
  },
});
