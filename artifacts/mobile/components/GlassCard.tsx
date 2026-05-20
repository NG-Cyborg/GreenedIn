import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";
import { getTipForNow } from "@/constants/farmingTips";
import { useColors } from "@/hooks/useColors";

function getGreeting(lang: import("@/constants/i18n").Language) {
  const hour = new Date().getHours();
  if (hour < 12) return t(lang, "goodMorning");
  if (hour < 17) return t(lang, "goodAfternoon");
  return t(lang, "goodEvening");
}

export function GlassCard() {
  const { user, language } = useApp();
  const colors = useColors();
  const router = useRouter();
  const tip = getTipForNow();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            Platform.OS === "ios"
              ? "rgba(255,255,255,0.55)"
              : "rgba(255,255,255,0.90)",
          borderColor: "rgba(255,255,255,0.6)",
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            {getGreeting(language)},{" "}
            <Text style={[styles.name, { color: colors.primary }]}>
              {user?.firstName ?? "Farmer"}
            </Text>
          </Text>
          <Text style={[styles.tip, { color: colors.foreground }]}>{tip}</Text>
        </View>
        <TouchableOpacity
          style={[styles.alaButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push("/chat")}
          activeOpacity={0.85}
        >
          <Feather name="message-circle" size={20} color="#FFFFFF" />
          <Text style={styles.alaLabel}>{t(language, "chatWithAlabi")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 8,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
  },
  name: {
    fontFamily: "Geist_700Bold",
  },
  tip: {
    fontSize: 14,
    fontFamily: "Lora_400Regular",
    lineHeight: 21,
  },
  alaButton: {
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    gap: 4,
    minWidth: 68,
  },
  alaLabel: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Geist_600SemiBold",
    textAlign: "center",
  },
});
