import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";
import { GlassCard } from "@/components/GlassCard";
import { WeatherWidget } from "@/components/WeatherWidget";
import { QuickTool } from "@/components/QuickTool";
import { MarketplaceCard } from "@/components/MarketplaceCard";
import { CourseCard } from "@/components/CourseCard";
import { OfflineBanner } from "@/components/OfflineBanner";
import { featuredCommodities } from "@/constants/marketData";
import { featuredCourses } from "@/constants/courses";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <OfflineBanner />

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
        <Text style={[styles.logoText, { color: colors.primary }]}>GreenedIn</Text>
        <View style={styles.headerRight}>
          <WeatherWidget />
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: colors.secondary }]}
            onPress={() => {}}
          >
            <Feather name="bell" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {t(language, "quickTools")}
          </Text>
          <View style={styles.toolsGrid}>
            <View style={styles.toolsRow}>
              <QuickTool
                icon={<Feather name="clipboard" size={22} color="#FFFFFF" />}
                label={t(language, "costTracking")}
                onPress={() => router.push("/(tabs)/track")}
                accent
              />
              <QuickTool
                icon={<Feather name="book-open" size={22} color={colors.primary} />}
                label={t(language, "knowledgeHub")}
                onPress={() => router.push("/(tabs)/update")}
              />
            </View>
            <View style={styles.toolsRow}>
              <QuickTool
                icon={<Feather name="users" size={22} color={colors.primary} />}
                label={t(language, "askCommunity")}
                onPress={() => router.push("/(tabs)/update")}
              />
              <QuickTool
                icon={<Feather name="shopping-bag" size={22} color={colors.primary} />}
                label={t(language, "marketplace")}
                onPress={() => router.push("/(tabs)/update")}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {t(language, "marketplace")}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/update")}>
              <Text style={[styles.seeAll, { color: colors.accent }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {featuredCommodities.map((item) => (
              <MarketplaceCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {t(language, "learningHub")}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/update")}>
              <Text style={[styles.seeAll, { color: colors.accent }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  logoText: {
    fontSize: 22,
    fontFamily: "Lora_700Bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  content: {
    paddingTop: 16,
    gap: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Lora_600SemiBold",
  },
  seeAll: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
  },
  toolsGrid: {
    gap: 10,
  },
  toolsRow: {
    flexDirection: "row",
    gap: 10,
  },
  horizontalList: {
    paddingRight: 16,
  },
});
