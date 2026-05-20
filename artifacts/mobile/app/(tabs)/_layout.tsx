import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";

export default function TabLayout() {
  const colors = useColors();
  const { language } = useApp();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: isWeb ? 84 : 60,
          paddingBottom: isWeb ? 34 : 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Geist_500Medium",
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={90}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t(language, "home"),
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: t(language, "track"),
          tabBarIcon: ({ color }) => <Feather name="clipboard" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inwealth"
        options={{
          title: t(language, "inwealth"),
          tabBarIcon: ({ color }) => <Feather name="trending-up" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="update"
        options={{
          title: t(language, "update"),
          tabBarIcon: ({ color }) => <Feather name="layers" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t(language, "profile"),
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
