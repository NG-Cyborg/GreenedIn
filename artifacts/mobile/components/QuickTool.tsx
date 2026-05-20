import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useColors } from "@/hooks/useColors";

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  accent?: boolean;
};

export function QuickTool({ icon, label, onPress, accent = false }: Props) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: accent ? colors.primary : colors.card,
          borderColor: accent ? colors.primary : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <Text
        style={[
          styles.label,
          { color: accent ? colors.primaryForeground : colors.foreground },
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 8,
    minHeight: 80,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontFamily: "Geist_500Medium",
    textAlign: "center",
  },
});
