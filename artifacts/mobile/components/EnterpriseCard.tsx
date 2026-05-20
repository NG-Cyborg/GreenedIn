import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { Enterprise } from "@/context/EnterpriseContext";
import { useColors } from "@/hooks/useColors";

type Props = {
  enterprise: Enterprise;
  onPress: () => void;
};

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getCostPerUnit(enterprise: Enterprise): number {
  const totalExpenses = enterprise.entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  if (enterprise.numberOfUnits === 0) return 0;
  return Math.round(totalExpenses / enterprise.numberOfUnits);
}

function getTypeIcon(type: Enterprise["type"]): string {
  switch (type) {
    case "poultry": return "feather";
    case "crop": return "sun";
    case "livestock": return "heart";
  }
}

function getUnitLabel(type: Enterprise["type"]): string {
  switch (type) {
    case "poultry": return "Cost/bird";
    case "crop": return "Cost/stand";
    case "livestock": return "Cost/animal";
  }
}

function getTypeLabel(type: Enterprise["type"]): string {
  switch (type) {
    case "poultry": return "Poultry";
    case "crop": return "Crop Farming";
    case "livestock": return "Livestock";
  }
}

export function EnterpriseCard({ enterprise, onPress }: Props) {
  const colors = useColors();
  const costPerUnit = getCostPerUnit(enterprise);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: colors.secondary },
        ]}
      >
        <Feather name={getTypeIcon(enterprise.type) as any} size={22} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]}>
          {enterprise.name}
        </Text>
        <Text style={[styles.type, { color: colors.mutedForeground }]}>
          {getTypeLabel(enterprise.type)} · {enterprise.numberOfUnits} units
        </Text>
        <Text style={[styles.date, { color: colors.mutedForeground }]}>
          Created {formatDate(enterprise.createdAt)}
        </Text>
      </View>
      <View style={styles.costBlock}>
        <Text style={[styles.costAmount, { color: colors.primary }]}>
          ₦{costPerUnit.toLocaleString()}
        </Text>
        <Text style={[styles.costLabel, { color: colors.mutedForeground }]}>
          {getUnitLabel(enterprise.type)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
  },
  type: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  date: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  costBlock: {
    alignItems: "flex-end",
    gap: 2,
  },
  costAmount: {
    fontSize: 16,
    fontFamily: "Geist_700Bold",
  },
  costLabel: {
    fontSize: 10,
    fontFamily: "Geist_400Regular",
  },
});
