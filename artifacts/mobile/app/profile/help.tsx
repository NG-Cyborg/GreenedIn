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

import { useColors } from "@/hooks/useColors";

const FAQS = [
  {
    q: "How do I add a farming enterprise?",
    a: 'Go to the Track tab and tap "Add New". Choose your enterprise type (Poultry, Crop, or Livestock), enter a name, and set the number of units. Once created, you can add revenue and expense entries to track your financials.',
  },
  {
    q: "How do I export my enterprise data?",
    a: 'On the Track tab, tap the "CSV" button in the top right. Your enterprise data — including all revenue and expense entries — will be exported as a CSV file that can be opened in Excel, Google Sheets, or any spreadsheet application.',
  },
  {
    q: "How does Alabi AI work?",
    a: "Alabi is your dedicated agricultural AI assistant powered by advanced language models. You can ask it farming questions, request advice on crop management, livestock care, pest control, or financial planning. Access Alabi from the home screen or from the Alabi button on any page.",
  },
  {
    q: "Can I use GreenedIn offline?",
    a: "Most of GreenedIn works offline — you can view your enterprises, track entries, and read course content you have already opened. The Alabi AI assistant and community features require an internet connection. An offline indicator appears at the top when you lose connectivity.",
  },
  {
    q: "How do I change my app language?",
    a: "Go to Profile and tap the Language option under Preferences. GreenedIn supports English, French, Hausa, Yoruba, Igbo, and Arabic.",
  },
  {
    q: "How do I list a product in the Marketplace?",
    a: 'Go to the Update tab and select Marketplace. Tap the "+ Product / Service" button and fill in the product name, price, location, and description. You can also add a photo of your product.',
  },
  {
    q: "My password is not working. What should I do?",
    a: "Make sure you are using the exact phone number and country code you registered with. Passwords are case-sensitive. If you have forgotten your password, contact support at support@greenedin.app — account recovery will be available in a future update.",
  },
  {
    q: "How do I track course progress?",
    a: "Open any course from the Knowledge Hub and work through each lesson. Tap \"Mark as Complete\" at the end of each lesson. Your progress percentage is displayed on the course card and at the top of the course reader.",
  },
];

export default function HelpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);
  const topPad = Platform.OS === "web" ? 0 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Help & Support</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          Find answers to common questions below. For additional support, reach us at support@greenedin.app.
        </Text>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>FREQUENTLY ASKED QUESTIONS</Text>

        {FAQS.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setExpanded(expanded === i ? null : i)}
            activeOpacity={0.85}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQ, { color: colors.foreground }]}>{faq.q}</Text>
              <Feather
                name={expanded === i ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.mutedForeground}
              />
            </View>
            {expanded === i && (
              <Text style={[styles.faqA, { color: colors.mutedForeground }]}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={[styles.contactCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.foreground }]}>Still need help?</Text>
          <Text style={[styles.contactText, { color: colors.mutedForeground }]}>
            Our support team responds within 24 hours.
          </Text>
          <View style={styles.contactRow}>
            <Feather name="mail" size={14} color={colors.accent} />
            <Text style={[styles.contactEmail, { color: colors.accent }]}>support@greenedin.app</Text>
          </View>
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
    gap: 10,
  },
  intro: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    lineHeight: 21,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Geist_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 4,
    marginBottom: 2,
  },
  faqCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  faqQ: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
    lineHeight: 20,
  },
  faqA: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    lineHeight: 20,
  },
  contactCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  contactTitle: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
  },
  contactText: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  contactEmail: {
    fontSize: 14,
    fontFamily: "Geist_500Medium",
  },
});
