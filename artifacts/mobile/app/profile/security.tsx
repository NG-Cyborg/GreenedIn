import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const SECURITY_TIPS = [
  {
    icon: "lock" as const,
    title: "Strong Password",
    desc: "Use a password of at least 8 characters mixing letters, numbers, and symbols. Never reuse passwords across platforms.",
  },
  {
    icon: "smartphone" as const,
    title: "Keep Your Device Secure",
    desc: "Set a PIN or biometric lock on your device. If your phone is lost or stolen, your GreenedIn data remains protected by your password.",
  },
  {
    icon: "log-out" as const,
    title: "Sign Out on Shared Devices",
    desc: "Always sign out of GreenedIn when using a shared or public device. Your session persists across app launches on private devices.",
  },
  {
    icon: "alert-triangle" as const,
    title: "Watch for Phishing",
    desc: "GreenedIn will never ask for your password via SMS, phone call, or email. Do not share your credentials with anyone.",
  },
  {
    icon: "wifi-off" as const,
    title: "Secure Networks",
    desc: "Avoid accessing GreenedIn on public Wi-Fi for sensitive operations like adding enterprise financial data. Use your mobile data when security is a concern.",
  },
];

export default function SecurityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useApp();
  const topPad = Platform.OS === "web" ? 0 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Privacy & Security</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statusCard, { backgroundColor: "#EBF7E6", borderColor: "#5CB840" }]}>
          <Feather name="shield" size={22} color="#2A5129" />
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: "#2A5129" }]}>Account Secured</Text>
            <Text style={styles.statusDesc}>
              {user ? `Signed in as ${user.firstName} ${user.surname}` : "Not signed in"} · Data encrypted locally
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ACCOUNT ACTIVITY</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { label: "Phone Number", value: user ? `${user.countryCode} ${user.phone}` : "—" },
            { label: "Email", value: user?.email || "Not set" },
            { label: "Account Type", value: user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—" },
          ].map((row, i) => (
            <View key={i} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.actionRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push("/profile/change-password")}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="key" size={16} color={colors.primary} />
          </View>
          <Text style={[styles.actionLabel, { color: colors.foreground }]}>Change Password</Text>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 8 }]}>SECURITY TIPS</Text>
        {SECURITY_TIPS.map((tip, i) => (
          <View key={i} style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.tipIcon, { backgroundColor: colors.secondary }]}>
              <Feather name={tip.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.tipInfo}>
              <Text style={[styles.tipTitle, { color: colors.foreground }]}>{tip.title}</Text>
              <Text style={[styles.tipDesc, { color: colors.mutedForeground }]}>{tip.desc}</Text>
            </View>
          </View>
        ))}
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
    gap: 12,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusInfo: { flex: 1 },
  statusTitle: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
  },
  statusDesc: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    color: "#2A5129",
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Geist_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
  },
  infoValue: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Geist_400Regular",
  },
  tipCard: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipInfo: { flex: 1, gap: 4 },
  tipTitle: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
  tipDesc: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    lineHeight: 18,
  },
});
