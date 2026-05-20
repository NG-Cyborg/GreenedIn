import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";

export function OfflineBanner() {
  const { isOffline, language } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  if (!isOffline) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#E53935",
          paddingTop: Platform.OS === "web" ? 8 : insets.top > 0 ? 4 : 8,
        },
      ]}
    >
      <Feather name="wifi-off" size={13} color="#FFFFFF" />
      <Text style={styles.text}>{t(language, "offline")}</Text>
      <Text style={styles.subtext}>{t(language, "offlineDesc")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Geist_600SemiBold",
  },
  subtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
});
