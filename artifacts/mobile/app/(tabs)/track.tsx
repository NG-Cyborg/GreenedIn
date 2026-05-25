import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

export default function TrackScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language } = useApp();
  const { enterprises } = useEnterprise();
  const [showModal, setShowModal] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

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
          <>
            <View style={[styles.exportHint, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Feather name="info" size={13} color={colors.mutedForeground} />
              <Text style={[styles.exportHintText, { color: colors.mutedForeground }]}>
                Open an enterprise and tap the 3-dot menu to export as CSV or XLS.
              </Text>
            </View>
            {enterprises.map((e) => (
              <EnterpriseCard
                key={e.id}
                enterprise={e}
                onPress={() => router.push(`/enterprise/${e.id}`)}
              />
            ))}
          </>
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
    gap: 10,
  },
  exportHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 11,
    marginBottom: 4,
  },
  exportHintText: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    flex: 1,
    lineHeight: 17,
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
