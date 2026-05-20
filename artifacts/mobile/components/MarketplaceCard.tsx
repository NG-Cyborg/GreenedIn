import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { CommodityPrice } from "@/constants/marketData";
import { useColors } from "@/hooks/useColors";

type Props = {
  item: CommodityPrice;
};

export function MarketplaceCard({ item }: Props) {
  const colors = useColors();
  const isUp = item.change >= 0;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
        <Feather name="trending-up" size={18} color={colors.primary} />
      </View>
      <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.unit, { color: colors.mutedForeground }]}>
        {item.unit}
      </Text>
      <Text style={[styles.price, { color: colors.foreground }]}>
        ₦{item.price.toLocaleString()}
      </Text>
      <View style={styles.changeRow}>
        <Feather
          name={isUp ? "arrow-up-right" : "arrow-down-right"}
          size={12}
          color={isUp ? "#22A55A" : "#E53935"}
        />
        <Text
          style={[
            styles.change,
            { color: isUp ? "#22A55A" : "#E53935" },
          ]}
        >
          {Math.abs(item.change)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 4,
    marginRight: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontFamily: "Geist_600SemiBold",
  },
  unit: {
    fontSize: 10,
    fontFamily: "Geist_400Regular",
  },
  price: {
    fontSize: 15,
    fontFamily: "Geist_700Bold",
    marginTop: 4,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  change: {
    fontSize: 11,
    fontFamily: "Geist_500Medium",
  },
});
