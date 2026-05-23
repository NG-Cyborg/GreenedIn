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

const PRIVACY_SECTIONS = [
  {
    title: "Data We Collect",
    content:
      "GreenedIn collects the information you provide when creating your account (name, phone number, and email), your farming enterprise data, and your course progress. We do not collect your location unless you voluntarily enter it in the marketplace section.",
  },
  {
    title: "How We Use Your Data",
    content:
      "Your data is used to personalize your experience, track your farming progress, power the Alabi AI assistant with your enterprise context, and improve our agricultural recommendations. We do not sell or share your personal information with third parties.",
  },
  {
    title: "Data Storage",
    content:
      "Your profile and enterprise data are stored locally on your device using secure local storage. AI chat interactions are processed through our encrypted API servers and are not stored permanently. Your session is maintained securely between app launches.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data at any time. You can sign out and delete your account through the Profile settings. Signing out removes your session; enterprise data remains on the device until the app is uninstalled.",
  },
  {
    title: "Third-Party Services",
    content:
      "GreenedIn uses OpenAI to power the Alabi AI assistant. Your farming queries are processed by this service. We recommend not sharing sensitive personal financial information in AI chat sessions. Weather data is sourced from publicly available meteorological APIs.",
  },
  {
    title: "Children's Privacy",
    content:
      "GreenedIn is designed for farmers, agricultural students, and enthusiasts aged 16 and above. We do not knowingly collect data from children under 13. If you believe a child has created an account, please contact us at support@greenedin.app.",
  },
  {
    title: "Updates to This Policy",
    content:
      "We may update this Privacy Policy as our services evolve. Any significant changes will be communicated through in-app notifications. Continued use of GreenedIn after a policy update constitutes acceptance of the revised terms.",
  },
];

export default function PrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 0 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Privacy Policy</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lastUpdated, { color: colors.mutedForeground }]}>
          Last updated: May 2025
        </Text>
        <Text style={[styles.intro, { color: colors.foreground }]}>
          GreenedIn is committed to protecting the privacy of every farmer and agricultural professional who uses our platform. This policy explains how we collect, use, and protect your information.
        </Text>
        {PRIVACY_SECTIONS.map((section, i) => (
          <View key={i} style={[styles.section, { borderLeftColor: colors.accent }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
            <Text style={[styles.sectionBody, { color: colors.mutedForeground }]}>{section.content}</Text>
          </View>
        ))}
        <View style={[styles.contactBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="mail" size={16} color={colors.primary} />
          <Text style={[styles.contactText, { color: colors.foreground }]}>
            Questions? Contact us at{" "}
            <Text style={{ color: colors.accent }}>support@greenedin.app</Text>
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
    padding: 20,
    gap: 16,
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  intro: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    lineHeight: 22,
  },
  section: {
    borderLeftWidth: 3,
    paddingLeft: 14,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
  },
  sectionBody: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    lineHeight: 21,
  },
  contactBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  contactText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    lineHeight: 20,
  },
});
