import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type WeatherData = {
  temp: number;
  city: string;
  country: string;
  condition: string;
};

export function WeatherWidget() {
  const colors = useColors();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (Platform.OS === "web") {
        setWeather({ temp: 29, city: "Lagos", country: "NG", condition: "sunny" });
        return;
      }
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setWeather({ temp: 29, city: "Lagos", country: "NG", condition: "sunny" });
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        const place = geo[0];
        const city = place?.city ?? place?.region ?? "Your Location";
        const country = place?.isoCountryCode ?? "NG";
        const resp = await global.fetch(
          `https://wttr.in/${loc.coords.latitude},${loc.coords.longitude}?format=j1`
        );
        if (resp.ok) {
          const data = await resp.json();
          const temp = Math.round(parseFloat(data.current_condition?.[0]?.temp_C ?? "29"));
          const desc = (data.current_condition?.[0]?.weatherDesc?.[0]?.value ?? "").toLowerCase();
          let condition = "sunny";
          if (desc.includes("rain") || desc.includes("drizzle")) condition = "rain";
          else if (desc.includes("cloud") || desc.includes("overcast")) condition = "cloudy";
          else if (desc.includes("thunder") || desc.includes("storm")) condition = "storm";
          setWeather({ temp, city, country, condition });
        } else {
          setWeather({ temp: 29, city, country, condition: "sunny" });
        }
      } catch {
        setWeather({ temp: 29, city: "Lagos", country: "NG", condition: "sunny" });
      }
    };
    fetch();
  }, []);

  if (!weather) {
    return (
      <View style={styles.container}>
        <View style={[styles.dot, { backgroundColor: colors.border }]} />
      </View>
    );
  }

  const iconName = weather.condition === "rain"
    ? "cloud-rain"
    : weather.condition === "cloudy"
    ? "cloud"
    : weather.condition === "storm"
    ? "cloud-lightning"
    : "sun";

  return (
    <View style={styles.container}>
      <Feather name={iconName as any} size={14} color={colors.accent} />
      <Text style={[styles.text, { color: colors.foreground }]}>
        {weather.temp}°C
      </Text>
      <Text style={[styles.city, { color: colors.mutedForeground }]}>
        {weather.city}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 13,
    fontFamily: "Geist_600SemiBold",
  },
  city: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
