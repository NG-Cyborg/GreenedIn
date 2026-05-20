import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useEnterprise } from "@/context/EnterpriseContext";
import type { WorksheetEntry } from "@/context/EnterpriseContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";

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

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
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
        <TouchableOpacity
          style={[styles.addEntryBtn, { backgroundColor: colors.primary }]}
          onPress={() => setAddModalVisible(true)}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={16} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>

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
          <Text style={[styles.costBannerValue, { color: totalRevenue - totalExpenses >= 0 ? "#A8E89C" : "#FF8A80" }]}>
            ₦{(totalRevenue - totalExpenses).toLocaleString()}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
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

      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setAddModalVisible(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOuter}
        >
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                {t(language, "addEntry")}
              </Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Feather name="x" size={22} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <View style={styles.typeToggle}>
              {(["expense", "revenue"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeBtn,
                    {
                      backgroundColor:
                        entryType === type
                          ? type === "revenue"
                            ? "#22A55A"
                            : "#E53935"
                          : colors.secondary,
                    },
                  ]}
                  onPress={() => setEntryType(type)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      {
                        color: entryType === type ? "#FFFFFF" : colors.mutedForeground,
                      },
                    ]}
                  >
                    {type === "revenue" ? t(language, "revenue") : t(language, "expenses")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalForm}>
              <TextInput
                style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
                value={entryDate}
                onChangeText={setEntryDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.mutedForeground}
              />
              <TextInput
                style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
                value={entryDesc}
                onChangeText={setEntryDesc}
                placeholder={t(language, "description")}
                placeholderTextColor={colors.mutedForeground}
              />
              <TextInput
                style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
                value={entryAmount}
                onChangeText={setEntryAmount}
                placeholder={t(language, "amount")}
                placeholderTextColor={colors.mutedForeground}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  {
                    backgroundColor:
                      !entryDesc || !entryAmount ? colors.muted : colors.primary,
                  },
                ]}
                onPress={handleAddEntry}
                disabled={!entryDesc || !entryAmount || saving}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.saveBtnText,
                    {
                      color: !entryDesc || !entryAmount ? colors.mutedForeground : colors.primaryForeground,
                    },
                  ]}
                >
                  {saving ? "Saving..." : t(language, "addEntry")}
                </Text>
              </TouchableOpacity>
            </View>
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
  addEntryBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
    gap: 20,
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
    gap: 0,
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
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalOuter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
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
    marginBottom: 16,
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
  modalForm: {
    paddingHorizontal: 24,
    gap: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
