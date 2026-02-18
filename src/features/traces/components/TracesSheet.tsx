import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { Trace } from "../../../data/storage";
import { tokens } from "../../../theme/tokens";
import { formatTraceTime } from "../../../utils/format";

type TracesSheetProps = {
  visible: boolean;
  traces: Trace[];
  onClose: () => void;
  onSelectTrace: (trace: Trace) => void;
};

export function TracesSheet({ visible, traces, onClose, onSelectTrace }: TracesSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalTapZone} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>TRACES</Text>
          <FlatList
            data={traces}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable style={styles.traceRow} onPress={() => onSelectTrace(item)}>
                <Text style={styles.tracePreview}>{item.preview}</Text>
                <Text style={styles.traceTime}>{formatTraceTime(item.createdAt)}</Text>
              </Pressable>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No traces yet.</Text>}
          />
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
    borderTopLeftRadius: tokens.radius.sheet,
    borderTopRightRadius: tokens.radius.sheet,
    paddingTop: 14,
    paddingBottom: 18,
    minHeight: "52%",
    maxHeight: "78%",
    marginTop: 20,
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
    paddingTop: 4,
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
    fontSize: 22,
    lineHeight: 40,
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
});
