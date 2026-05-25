import { Feather } from "@expo/vector-icons";
import * as FileSystemModule from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useEnterprise } from "@/context/EnterpriseContext";
import type { WorksheetEntry } from "@/context/EnterpriseContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";

const FileSystem = FileSystemModule as typeof FileSystemModule & {
  documentDirectory: string | null;
  writeAsStringAsync: (uri: string, contents: string, options?: { encoding?: string }) => Promise<void>;
  EncodingType: { UTF8: string };
};

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function buildCSV(enterprise: ReturnType<typeof useEnterprise>["enterprises"][number]): string {
  const rows = ["Date,Description,Type,Amount (NGN)"];
  for (const e of enterprise.entries) {
    rows.push(`"${e.date}","${e.description}","${e.type}","${e.amount}"`);
  }
  return rows.join("\n");
}

function buildXLS(enterprise: ReturnType<typeof useEnterprise>["enterprises"][number]): string {
  const escape = (s: string | number) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const headerCells = ["Date", "Description", "Type", "Amount (NGN)"]
    .map((h) => `<Cell><Data ss:Type="String">${escape(h)}</Data></Cell>`)
    .join("");

  const dataRows = enterprise.entries
    .map((e) => {
      const cells = [e.date, e.description, e.type, e.amount]
        .map((v, i) =>
          `<Cell><Data ss:Type="${i === 3 ? "Number" : "String"}">${escape(v)}</Data></Cell>`
        )
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("\n");

  return `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="${escape(enterprise.name)}">
  <Table>
   <Row>${headerCells}</Row>
   ${dataRows}
  </Table>
 </Worksheet>
</Workbook>`;
}

export default function EnterpriseDetail() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language } = useApp();
  const { enterprises, addEntry, deleteEntry } = useEnterprise();

  const enterprise = enterprises.find((e) => e.id === id);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [entryType, setEntryType] = useState<"revenue" | "expense">("expense");
  const [entryDesc, setEntryDesc] = useState("");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryDate, setEntryDate] = useState(todayISO());
  const [saving, setSaving] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!enterprise) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, textAlign: "center", marginTop: 80 }}>
          Enterprise not found
        </Text>
      </View>
    );
  }

  const revenues = enterprise.entries.filter((e) => e.type === "revenue");
  const expenses = enterprise.entries.filter((e) => e.type === "expense");
  const totalRevenue = revenues.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const costPerUnit =
    enterprise.numberOfUnits > 0
      ? Math.round(totalExpenses / enterprise.numberOfUnits)
      : 0;

  const unitLabel =
    enterprise.type === "poultry"
      ? t(language, "costPerBird")
      : enterprise.type === "crop"
      ? t(language, "costPerStand")
      : t(language, "costPerAnimal");

  const handleAddEntry = async () => {
    if (!entryDesc.trim() || !entryAmount) return;
    setSaving(true);
    await addEntry(enterprise.id, {
      date: entryDate,
      description: entryDesc.trim(),
      amount: parseFloat(entryAmount) || 0,
      type: entryType,
    });
    setEntryDesc("");
    setEntryAmount("");
    setEntryDate(todayISO());
    setSaving(false);
    setAddModalVisible(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (Platform.OS === "web") {
      deleteEntry(enterprise.id, entryId);
      return;
    }
    Alert.alert("Delete Entry", "Remove this entry?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteEntry(enterprise.id, entryId) },
    ]);
  };

  const doExport = async (format: "csv" | "xls") => {
    if (enterprise.entries.length === 0) {
      Alert.alert("No Entries", "Add revenue or expense entries before exporting.");
      setShowExportMenu(false);
      return;
    }
    setShowExportMenu(false);
    setExporting(true);

    try {
      const fileName = `${enterprise.name.replace(/[^a-z0-9]/gi, "_")}.${format}`;
      const content = format === "csv" ? buildCSV(enterprise) : buildXLS(enterprise);
      const mimeType = format === "csv" ? "text/csv" : "application/vnd.ms-excel";

      if (Platform.OS === "web") {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const fileUri = (FileSystem.documentDirectory ?? "") + fileName;
        await FileSystem.writeAsStringAsync(fileUri, content, {
          encoding: FileSystem.EncodingType?.UTF8 ?? "utf8",
        });
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri, {
            mimeType,
            dialogTitle: `Export ${enterprise.name}`,
          });
        } else {
          Alert.alert("Exported", `Saved to: ${fileUri}`);
        }
      }
    } catch {
      Alert.alert("Export Failed", "Could not export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const topPad = Platform.OS === "web" ? 0 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 8,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={[styles.enterpriseName, { color: colors.foreground }]} numberOfLines={1}>
            {enterprise.name}
          </Text>
          <Text style={[styles.enterpriseMeta, { color: colors.mutedForeground }]}>
            Created {formatDate(enterprise.createdAt)} · {enterprise.numberOfUnits} units
          </Text>
        </View>

        {/* 3-dot export menu */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
            onPress={() => setShowExportMenu((v) => !v)}
            activeOpacity={0.8}
          >
            <Feather name="more-vertical" size={18} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.primary }]}
            onPress={() => setAddModalVisible(true)}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={18} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Export dropdown ── */}
      {showExportMenu && (
        <>
          <TouchableWithoutFeedback onPress={() => setShowExportMenu(false)}>
            <View style={styles.exportOverlay} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.exportMenu,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={[styles.exportMenuItem, { borderBottomColor: colors.border }]}
              onPress={() => doExport("csv")}
              activeOpacity={0.7}
            >
              <Feather name="file-text" size={15} color={colors.primary} />
              <Text style={[styles.exportMenuText, { color: colors.foreground }]}>
                Export as CSV
              </Text>
              <Text style={[styles.exportMenuSub, { color: colors.mutedForeground }]}>
                Google Sheets, Numbers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportMenuItem}
              onPress={() => doExport("xls")}
              activeOpacity={0.7}
            >
              <Feather name="grid" size={15} color="#1D6F42" />
              <Text style={[styles.exportMenuText, { color: colors.foreground }]}>
                Export as XLS
              </Text>
              <Text style={[styles.exportMenuSub, { color: colors.mutedForeground }]}>
                Microsoft Excel
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* ── Cost banner ── */}
      <View style={[styles.costBanner, { backgroundColor: colors.primary }]}>
        <View>
          <Text style={styles.costBannerLabel}>{unitLabel}</Text>
          <Text style={styles.costBannerValue}>
            ₦{costPerUnit.toLocaleString()}
          </Text>
        </View>
        <View style={styles.costBannerDivider} />
        <View>
          <Text style={styles.costBannerLabel}>Net</Text>
          <Text
            style={[
              styles.costBannerValue,
              { color: totalRevenue - totalExpenses >= 0 ? "#A8E89C" : "#FF8A80" },
            ]}
          >
            ₦{(totalRevenue - totalExpenses).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* ── Entries list ── */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Revenue section */}
        <View style={styles.worksheetSection}>
          <View style={styles.worksheetHeader}>
            <Feather name="arrow-up-circle" size={16} color="#22A55A" />
            <Text style={[styles.worksheetTitle, { color: colors.foreground }]}>
              {t(language, "revenue")}
            </Text>
            <TouchableOpacity
              onPress={() => { setEntryType("revenue"); setAddModalVisible(true); }}
            >
              <Feather name="plus-circle" size={18} color="#22A55A" />
            </TouchableOpacity>
          </View>
          {revenues.length === 0 ? (
            <Text style={[styles.emptyRow, { color: colors.mutedForeground }]}>
              No revenue entries yet
            </Text>
          ) : (
            <View style={[styles.table, { borderColor: colors.border }]}>
              <View style={[styles.tableHead, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.colDate, styles.headText, { color: colors.mutedForeground }]}>Date</Text>
                <Text style={[styles.colDesc, styles.headText, { color: colors.mutedForeground }]}>Description</Text>
                <Text style={[styles.colAmount, styles.headText, { color: colors.mutedForeground }]}>Amount</Text>
                <View style={styles.colAction} />
              </View>
              {revenues.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onDelete={() => handleDeleteEntry(entry.id)}
                  colors={colors}
                />
              ))}
            </View>
          )}
        </View>

        {/* Expense section */}
        <View style={styles.worksheetSection}>
          <View style={styles.worksheetHeader}>
            <Feather name="arrow-down-circle" size={16} color="#E53935" />
            <Text style={[styles.worksheetTitle, { color: colors.foreground }]}>
              {t(language, "expenses")}
            </Text>
            <TouchableOpacity
              onPress={() => { setEntryType("expense"); setAddModalVisible(true); }}
            >
              <Feather name="plus-circle" size={18} color="#E53935" />
            </TouchableOpacity>
          </View>
          {expenses.length === 0 ? (
            <Text style={[styles.emptyRow, { color: colors.mutedForeground }]}>
              No expense entries yet
            </Text>
          ) : (
            <View style={[styles.table, { borderColor: colors.border }]}>
              <View style={[styles.tableHead, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.colDate, styles.headText, { color: colors.mutedForeground }]}>Date</Text>
                <Text style={[styles.colDesc, styles.headText, { color: colors.mutedForeground }]}>Description</Text>
                <Text style={[styles.colAmount, styles.headText, { color: colors.mutedForeground }]}>Amount</Text>
                <View style={styles.colAction} />
              </View>
              {expenses.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onDelete={() => handleDeleteEntry(entry.id)}
                  colors={colors}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Totals bar ── */}
      <View
        style={[
          styles.totalsBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 8,
          },
        ]}
      >
        <View style={styles.totalItem}>
          <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>
            {t(language, "totalRevenue")}
          </Text>
          <Text style={[styles.totalValue, { color: "#22A55A" }]}>
            ₦{totalRevenue.toLocaleString()}
          </Text>
        </View>
        <View style={[styles.totalDivider, { backgroundColor: colors.border }]} />
        <View style={styles.totalItem}>
          <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>
            {t(language, "totalExpenses")}
          </Text>
          <Text style={[styles.totalValue, { color: "#E53935" }]}>
            ₦{totalExpenses.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* ── Add Entry Modal — properly keyboard-aware ── */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Backdrop tap-to-dismiss */}
          <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          {/* Sheet */}
          <View style={[styles.modal, { backgroundColor: colors.background, paddingBottom: Platform.OS === "ios" ? insets.bottom + 16 : 24 }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                {t(language, "addEntry")}
              </Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Feather name="x" size={22} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {/* Type toggle */}
            <View style={styles.typeToggle}>
              {(["expense", "revenue"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeBtn,
                    {
                      backgroundColor:
                        entryType === type
                          ? type === "revenue" ? "#22A55A" : "#E53935"
                          : colors.secondary,
                    },
                  ]}
                  onPress={() => setEntryType(type)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      { color: entryType === type ? "#FFFFFF" : colors.mutedForeground },
                    ]}
                  >
                    {type === "revenue" ? t(language, "revenue") : t(language, "expenses")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Form fields */}
            <ScrollView
              style={styles.modalScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalForm}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Date</Text>
                  <TextInput
                    style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
                    value={entryDate}
                    onChangeText={setEntryDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.mutedForeground}
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Description</Text>
                  <TextInput
                    style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
                    value={entryDesc}
                    onChangeText={setEntryDesc}
                    placeholder={t(language, "description")}
                    placeholderTextColor={colors.mutedForeground}
                    returnKeyType="next"
                    autoFocus={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Amount (NGN)</Text>
                  <TextInput
                    style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
                    value={entryAmount}
                    onChangeText={setEntryAmount}
                    placeholder={t(language, "amount")}
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    onSubmitEditing={handleAddEntry}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.saveBtn,
                    { backgroundColor: !entryDesc || !entryAmount ? colors.muted : colors.primary },
                  ]}
                  onPress={handleAddEntry}
                  disabled={!entryDesc || !entryAmount || saving}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.saveBtnText,
                      { color: !entryDesc || !entryAmount ? colors.mutedForeground : colors.primaryForeground },
                    ]}
                  >
                    {saving ? "Saving..." : t(language, "addEntry")}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function EntryRow({
  entry,
  onDelete,
  colors,
}: {
  entry: WorksheetEntry;
  onDelete: () => void;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View style={[styles.tableRow, { borderTopColor: colors.border }]}>
      <Text style={[styles.colDate, styles.cellText, { color: colors.mutedForeground }]}>
        {entry.date}
      </Text>
      <Text style={[styles.colDesc, styles.cellText, { color: colors.foreground }]} numberOfLines={2}>
        {entry.description}
      </Text>
      <Text
        style={[
          styles.colAmount,
          styles.cellText,
          { color: entry.type === "revenue" ? "#22A55A" : "#E53935" },
        ]}
      >
        ₦{entry.amount.toLocaleString()}
      </Text>
      <TouchableOpacity style={styles.colAction} onPress={onDelete}>
        <Feather name="trash-2" size={14} color={colors.mutedForeground} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, gap: 2 },
  enterpriseName: {
    fontSize: 17,
    fontFamily: "Geist_600SemiBold",
  },
  enterpriseMeta: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  exportOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  exportMenu: {
    position: "absolute",
    top: 90,
    right: 16,
    borderRadius: 14,
    borderWidth: 1,
    zIndex: 20,
    overflow: "hidden",
    minWidth: 220,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  exportMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  exportMenuText: {
    fontSize: 14,
    fontFamily: "Geist_500Medium",
    flex: 1,
  },
  exportMenuSub: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  costBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 20,
  },
  costBannerLabel: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  costBannerValue: {
    fontSize: 22,
    fontFamily: "Geist_700Bold",
    color: "#FFFFFF",
    marginTop: 2,
  },
  costBannerDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  scroll: {
    padding: 16,
  },
  worksheetSection: {
    marginBottom: 24,
    gap: 10,
  },
  worksheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  worksheetTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Lora_600SemiBold",
  },
  emptyRow: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    fontStyle: "italic",
    paddingVertical: 8,
  },
  table: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  headText: {
    fontSize: 10,
    fontFamily: "Geist_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cellText: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  colDate: { width: 80 },
  colDesc: { flex: 1 },
  colAmount: { width: 90, textAlign: "right" },
  colAction: { width: 32, alignItems: "center" },
  totalsBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 14,
    paddingHorizontal: 24,
  },
  totalItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: "Geist_700Bold",
  },
  totalDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  // Modal
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Lora_600SemiBold",
  },
  typeToggle: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  typeBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  typeBtnText: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
  modalScroll: {
    flexShrink: 1,
  },
  modalForm: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 14,
    paddingBottom: 8,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "Geist_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
  },
});
