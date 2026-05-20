import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";
import { CourseCard } from "@/components/CourseCard";
import { MarketplaceCard } from "@/components/MarketplaceCard";
import { OfflineBanner } from "@/components/OfflineBanner";
import { courses } from "@/constants/courses";
import { commodities } from "@/constants/marketData";

type Tab = "knowledge" | "community" | "marketplace";

const COMMUNITY_POSTS = [
  {
    id: "1",
    author: "Adewale F.",
    role: "Farmer · Ogun State",
    time: "2h ago",
    question: "What is the best organic fertilizer for maize during the early growth stage?",
    replies: 14,
    likes: 32,
  },
  {
    id: "2",
    author: "Ngozi E.",
    role: "Agronomist · Enugu",
    time: "5h ago",
    question: "Has anyone tried companion planting tomatoes with basil for pest management in the southwest zone?",
    replies: 7,
    likes: 19,
  },
  {
    id: "3",
    author: "Musa A.",
    role: "Student · Zaria",
    time: "1d ago",
    question: "I need advice on managing Newcastle disease outbreak in my 500-bird layer flock.",
    replies: 22,
    likes: 41,
  },
];

export default function UpdateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("knowledge");
  const [searchQuery, setSearchQuery] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const tabs: { key: Tab; label: string }[] = [
    { key: "knowledge", label: t(language, "knowledgeHub") },
    { key: "community", label: t(language, "askCommunity") },
    { key: "marketplace", label: t(language, "marketplace") },
  ];

  const filteredCourses = courses.filter((c) =>
    searchQuery === "" ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t(language, "update")}
        </Text>
        <View style={[styles.tabs, { backgroundColor: colors.secondary }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && {
                  backgroundColor: colors.card,
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: 2,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === tab.key ? colors.primary : colors.mutedForeground,
                    fontFamily: activeTab === tab.key ? "Geist_600SemiBold" : "Geist_400Regular",
                  },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === "knowledge" && (
        <>
          <View style={[styles.searchBar, { paddingHorizontal: 16, paddingVertical: 12 }]}>
            <View style={[styles.searchInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="search" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.searchText, { color: colors.foreground }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search courses..."
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </View>
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </ScrollView>
        </>
      )}

      {activeTab === "community" && (
        <>
          <View style={[styles.searchBar, { paddingHorizontal: 16, paddingVertical: 12 }]}>
            <TouchableOpacity
              style={[styles.postBtn, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
            >
              <Feather name="edit-2" size={15} color={colors.primaryForeground} />
              <Text style={[styles.postBtnText, { color: colors.primaryForeground }]}>
                Ask a question
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {COMMUNITY_POSTS.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={[
                  styles.postCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                activeOpacity={0.85}
              >
                <View style={styles.postHeader}>
                  <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>
                      {post.author.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={[styles.authorName, { color: colors.foreground }]}>
                      {post.author}
                    </Text>
                    <Text style={[styles.authorRole, { color: colors.mutedForeground }]}>
                      {post.role} · {post.time}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.postQuestion, { color: colors.foreground }]}>
                  {post.question}
                </Text>
                <View style={styles.postMeta}>
                  <View style={styles.metaItem}>
                    <Feather name="message-circle" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                      {post.replies} replies
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Feather name="heart" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                      {post.likes}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {activeTab === "marketplace" && (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.marketSubhead, { color: colors.mutedForeground }]}>
            Live commodity prices — Nigerian markets
          </Text>
          <View style={styles.marketGrid}>
            {commodities.map((item) => (
              <MarketplaceCard key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Lora_700Bold",
  },
  tabs: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  tabText: {
    fontSize: 11,
    textAlign: "center",
  },
  searchBar: {},
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Geist_400Regular",
  },
  postBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  postBtnText: {
    fontSize: 13,
    fontFamily: "Geist_600SemiBold",
  },
  content: {
    padding: 16,
    gap: 10,
  },
  postCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontFamily: "Geist_700Bold",
  },
  authorInfo: { gap: 2 },
  authorName: {
    fontSize: 13,
    fontFamily: "Geist_600SemiBold",
  },
  authorRole: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  postQuestion: {
    fontSize: 14,
    fontFamily: "Lora_400Regular",
    lineHeight: 21,
  },
  postMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  marketSubhead: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    paddingBottom: 8,
  },
  marketGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
