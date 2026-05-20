import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";

export default function InwealthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
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
          {t(language, "inwealth")}
        </Text>
      </View>

      <View style={styles.center}>
        <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
          <Feather name="lock" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.heading, { color: colors.foreground }]}>
          {t(language, "inwealthComingSoon")}
        </Text>
        <Text style={[styles.desc, { color: colors.mutedForeground }]}>
          {t(language, "inwealthDesc")}
        </Text>

        <View style={[styles.badge, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="zap" size={13} color={colors.accent} />
          <Text style={[styles.badgeText, { color: colors.primary }]}>
            Agricultural fintech — launching 2025
          </Text>
        </View>

        <View style={styles.featureList}>
          {[
            "Farm credit & microloans",
            "Crop insurance plans",
            "Cooperative investment pools",
            "Revenue-based financing",
          ].map((feature) => (
            <View key={feature} style={styles.featureItem}>
              <Feather name="check-circle" size={15} color={colors.accent} />
              <Text style={[styles.featureText, { color: colors.foreground }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: "Lora_700Bold",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontFamily: "Lora_700Bold",
    textAlign: "center",
  },
  desc: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Geist_500Medium",
  },
  featureList: {
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
  },
});
