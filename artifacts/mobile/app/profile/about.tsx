import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const FEATURES = [
  { icon: "clipboard" as const, title: "Enterprise Tracking", desc: "Track revenue and expenses for poultry, crop, and livestock enterprises with automatic profit/loss calculations." },
  { icon: "book-open" as const, title: "Knowledge Hub", desc: "Access professional-grade courses on poultry nutrition, vaccination, disease diagnostics, and broiler management." },
  { icon: "users" as const, title: "Ask Community", desc: "Connect with farmers and agricultural experts across Africa. Ask questions, share knowledge, and grow together." },
  { icon: "shopping-bag" as const, title: "Marketplace", desc: "View live commodity prices from Nigerian agricultural markets and list your own products and services." },
  { icon: "message-circle" as const, title: "Alabi AI", desc: "Get instant answers to your farming questions from Alabi, your dedicated agricultural AI assistant." },
];

export default function AboutScreen() {
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>About GreenedIn</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.tagline, { color: colors.primary }]}>
            Farming smarter, together.
          </Text>
          <Text style={[styles.version, { color: colors.mutedForeground }]}>Version 1.0.0</Text>
        </View>

        <View style={[styles.missionCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Text style={[styles.missionTitle, { color: colors.foreground }]}>Our Mission</Text>
          <Text style={[styles.missionText, { color: colors.mutedForeground }]}>
            GreenedIn exists to empower African farmers with the knowledge, tools, and community they need to build profitable, sustainable agricultural enterprises. We believe that access to professional farming knowledge should not be limited to those with formal agricultural education.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>WHAT WE OFFER</Text>
        {FEATURES.map((f, i) => (
          <View key={i} style={[styles.featureRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.featureIcon, { backgroundColor: colors.secondary }]}>
              <Feather name={f.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>{f.title}</Text>
              <Text style={[styles.featureDesc, { color: colors.mutedForeground }]}>{f.desc}</Text>
            </View>
          </View>
        ))}

        <View style={[styles.contactBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.foreground }]}>Get in Touch</Text>
          {[
            { icon: "mail" as const, text: "support@greenedin.app" },
            { icon: "globe" as const, text: "www.greenedin.app" },
          ].map((c, i) => (
            <View key={i} style={styles.contactRow}>
              <Feather name={c.icon} size={14} color={colors.accent} />
              <Text style={[styles.contactText, { color: colors.mutedForeground }]}>{c.text}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.copyright, { color: colors.mutedForeground }]}>
          © 2025 GreenedIn. All rights reserved.{"\n"}Built for African farmers.
        </Text>
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
  heroSection: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 6,
  },
  logo: {
    width: 160,
    height: 65,
  },
  tagline: {
    fontSize: 17,
    fontFamily: "Lora_400Regular_Italic",
    textAlign: "center",
  },
  version: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  missionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  missionTitle: {
    fontSize: 16,
    fontFamily: "Lora_600SemiBold",
  },
  missionText: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    lineHeight: 21,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Geist_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  featureRow: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureInfo: { flex: 1, gap: 3 },
  featureTitle: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
  featureDesc: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    lineHeight: 18,
  },
  contactBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    marginTop: 4,
  },
  contactTitle: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
    marginBottom: 2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contactText: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
  },
  copyright: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
  },
});
