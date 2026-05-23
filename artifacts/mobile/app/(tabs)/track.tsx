import { Feather } from "@expo/vector-icons";
import * as FileSystemModule from "expo-file-system";
import * as Sharing from "expo-sharing";

const FileSystem = FileSystemModule as typeof FileSystemModule & {
  documentDirectory: string | null;
  writeAsStringAsync: (uri: string, contents: string, options?: { encoding?: string }) => Promise<void>;
  EncodingType: { UTF8: string };
};
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useEnterprise } from "@/context/EnterpriseContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";
import { EnterpriseCard } from "@/components/EnterpriseCard";
import { AddEnterpriseModal } from "@/components/AddEnterpriseModal";
import { OfflineBanner } from "@/components/OfflineBanner";

function buildCSV(enterprises: ReturnType<typeof useEnterprise>["enterprises"]): string {
  const rows: string[] = [];
  rows.push("Enterprise Name,Type,Units,Created,Date,Description,Type,Amount (NGN)");
  for (const e of enterprises) {
    if (e.entries.length === 0) {
      rows.push(`"${e.name}","${e.type}","${e.numberOfUnits}","${e.createdAt.split("T")[0]}","","","",""`);
    } else {
      for (const entry of e.entries) {
        rows.push(
          `"${e.name}","${e.type}","${e.numberOfUnits}","${e.createdAt.split("T")[0]}","${entry.date}","${entry.description}","${entry.type}","${entry.amount}"`
        );
      }
    }
  }
  return rows.join("\n");
}

export default function TrackScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language } = useApp();
  const { enterprises } = useEnterprise();
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleExport = async () => {
    if (enterprises.length === 0) {
      Alert.alert("No Data", "Add enterprises and entries before exporting.");
      return;
    }
    setExporting(true);
    try {
      const csv = buildCSV(enterprises);
      if (Platform.OS === "web") {
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "GreenedIn_Enterprises.csv";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const fileUri = FileSystem.documentDirectory + "GreenedIn_Enterprises.csv";
        await FileSystem.writeAsStringAsync(fileUri, csv, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "text/csv",
            dialogTitle: "Export Enterprise Data",
            UTI: "public.comma-separated-values-text",
          });
        } else {
          Alert.alert("Exported", `File saved to: ${fileUri}`);
        }
      }
    } catch {
      Alert.alert("Export Failed", "Could not export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <OfflineBanner />
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t(language, "track")}
        </Text>
        <View style={styles.headerBtns}>
          {enterprises.length > 0 && (
            <TouchableOpacity
              style={[styles.exportBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
              onPress={handleExport}
              disabled={exporting}
              activeOpacity={0.85}
            >
              <Feather name="download" size={14} color={colors.primary} />
              <Text style={[styles.exportBtnText, { color: colors.primary }]}>
                {exporting ? "..." : "CSV"}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowModal(true)}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={16} color={colors.primaryForeground} />
            <Text style={[styles.addBtnText, { color: colors.primaryForeground }]}>
              {t(language, "addNew")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {enterprises.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="clipboard" size={48} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No enterprises yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Tap "Add New" to start tracking your farming activities
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={() => setShowModal(true)}
              activeOpacity={0.85}
            >
              <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>
                {t(language, "addNew")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          enterprises.map((e) => (
            <EnterpriseCard
              key={e.id}
              enterprise={e}
              onPress={() => router.push(`/enterprise/${e.id}`)}
            />
          ))
        )}
      </ScrollView>

      <AddEnterpriseModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(id) => {
          setShowModal(false);
          router.push(`/enterprise/${id}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: "Lora_700Bold",
  },
  headerBtns: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  exportBtnText: {
    fontSize: 12,
    fontFamily: "Geist_600SemiBold",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  addBtnText: {
    fontSize: 13,
    fontFamily: "Geist_600SemiBold",
  },
  scroll: { flex: 1 },
  content: {
    padding: 16,
    gap: 2,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Lora_600SemiBold",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    textAlign: "center",
    maxWidth: 260,
  },
  emptyBtn: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  emptyBtnText: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
});
