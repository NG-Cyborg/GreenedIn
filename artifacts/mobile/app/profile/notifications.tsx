import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type Setting = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  enabled: boolean;
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 0 : insets.top;

  const [settings, setSettings] = useState<Setting[]>([
    { id: "community", icon: "users", title: "Community Replies", desc: "Get notified when someone replies to your question", enabled: true },
    { id: "courses", icon: "book-open", title: "Course Updates", desc: "Notifications when new courses are available", enabled: true },
    { id: "prices", icon: "trending-up", title: "Market Price Alerts", desc: "Alerts when commodity prices change significantly", enabled: false },
    { id: "tips", icon: "sun", title: "Daily Farming Tips", desc: "A daily agricultural tip tailored to your enterprise", enabled: true },
    { id: "alabi", icon: "message-circle", title: "Alabi AI Responses", desc: "Notifications when Alabi answers a queued question", enabled: false },
  ]);

  const toggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Notifications</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.desc, { color: colors.mutedForeground }]}>
          Manage which notifications you receive from GreenedIn.
        </Text>
        <View style={[styles.settingsList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {settings.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.settingRow,
                { borderBottomColor: colors.border, borderBottomWidth: i < settings.length - 1 ? StyleSheet.hairlineWidth : 0 },
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: colors.secondary }]}>
                <Feather name={s.icon as any} size={16} color={colors.primary} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowTitle, { color: colors.foreground }]}>{s.title}</Text>
                <Text style={[styles.rowDesc, { color: colors.mutedForeground }]}>{s.desc}</Text>
              </View>
              <Switch
                value={s.enabled}
                onValueChange={() => toggle(s.id)}
                trackColor={{ false: colors.border, true: "#5CB840" }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>
        <View style={[styles.infoBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Push notifications will be available in a future update. In-app notifications are active now.
          </Text>
        </View>
      </ScrollView>
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
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Lora_600SemiBold",
  },
  content: {
    padding: 16,
    gap: 14,
  },
  desc: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    lineHeight: 21,
  },
  settingsList: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowInfo: { flex: 1, gap: 3 },
  rowTitle: {
    fontSize: 14,
    fontFamily: "Geist_500Medium",
  },
  rowDesc: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
    lineHeight: 16,
  },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    lineHeight: 18,
  },
});
