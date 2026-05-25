import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useCourseProgress } from "@/context/CourseProgressContext";
import { courses } from "@/constants/courses";

export default function CourseReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { markLessonComplete, isLessonComplete, getCourseProgress } = useCourseProgress();
  const contentScrollRef = useRef<ScrollView>(null);

  const course = courses.find((c) => c.id === id);
  const [activeLesson, setActiveLesson] = useState(0);
  const [showLessonList, setShowLessonList] = useState(false);

  if (!course) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, padding: 20 }}>Course not found.</Text>
      </View>
    );
  }

  const lesson = course.lessonList[activeLesson];
  const progress = getCourseProgress(course.id, course.lessonList.length);
  const lessonDone = lesson ? isLessonComplete(course.id, lesson.id) : false;
  const topPad = Platform.OS === "web" ? 0 : insets.top;

  const handleMarkComplete = async () => {
    if (!lesson) return;
    await markLessonComplete(course.id, lesson.id);
  };

  const goToLesson = (idx: number) => {
    setActiveLesson(idx);
    setShowLessonList(false);
    contentScrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const goNext = () => {
    if (activeLesson < course.lessonList.length - 1) {
      goToLesson(activeLesson + 1);
    }
  };

  const goPrev = () => {
    if (activeLesson > 0) {
      goToLesson(activeLesson - 1);
    }
  };

  const completedCount = course.lessonList.filter((l) =>
    isLessonComplete(course.id, l.id)
  ).length;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerCategory} numberOfLines={1}>
            {course.category} · {course.level}
          </Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {course.title}
          </Text>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <View style={[styles.progressBar, { backgroundColor: "rgba(42,81,41,0.15)" }]}>
        <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
      </View>

      {/* ── Lesson selector ── */}
      <TouchableOpacity
        style={[styles.lessonSelector, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setShowLessonList((v) => !v)}
        activeOpacity={0.8}
      >
        <View style={styles.lessonSelectorLeft}>
          <View style={[styles.lessonNumBadge, { backgroundColor: lessonDone ? "#5CB840" : colors.primary }]}>
            {lessonDone
              ? <Feather name="check" size={12} color="#FFFFFF" />
              : <Text style={styles.lessonNumBadgeText}>{activeLesson + 1}</Text>
            }
          </View>
          <View style={styles.lessonSelectorInfo}>
            <Text style={[styles.lessonSelectorMeta, { color: colors.mutedForeground }]}>
              Lesson {activeLesson + 1} of {course.lessonList.length} · {completedCount}/{course.lessonList.length} complete
            </Text>
            <Text style={[styles.lessonSelectorTitle, { color: colors.foreground }]} numberOfLines={1}>
              {lesson?.title}
            </Text>
          </View>
        </View>
        <Feather
          name={showLessonList ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.mutedForeground}
        />
      </TouchableOpacity>

      {/* ── Lesson list dropdown ── */}
      {showLessonList && (
        <View style={[styles.lessonDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
            {course.lessonList.map((l, idx) => {
              const done = isLessonComplete(course.id, l.id);
              const active = idx === activeLesson;
              return (
                <TouchableOpacity
                  key={l.id}
                  style={[
                    styles.dropdownItem,
                    {
                      backgroundColor: active ? colors.secondary : "transparent",
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() => goToLesson(idx)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.dropdownCheck, { backgroundColor: done ? "#5CB840" : colors.border }]}>
                    {done
                      ? <Feather name="check" size={10} color="#FFFFFF" />
                      : <Text style={[styles.dropdownNum, { color: active ? colors.primary : colors.mutedForeground }]}>{idx + 1}</Text>
                    }
                  </View>
                  <View style={styles.dropdownText}>
                    <Text
                      style={[
                        styles.dropdownTitle,
                        {
                          color: active ? colors.primary : colors.foreground,
                          fontFamily: active ? "Geist_600SemiBold" : "Geist_400Regular",
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {l.title}
                    </Text>
                    <Text style={[styles.dropdownDuration, { color: colors.mutedForeground }]}>
                      {l.duration}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* ── Full-width lesson content ── */}
      <ScrollView
        ref={contentScrollRef}
        style={styles.contentScroll}
        contentContainerStyle={[
          styles.contentInner,
          { paddingBottom: Platform.OS === "web" ? 60 : insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {lesson && (
          <>
            <View style={styles.lessonHeader}>
              <View style={[styles.durationBadge, { backgroundColor: colors.secondary }]}>
                <Feather name="clock" size={12} color={colors.mutedForeground} />
                <Text style={[styles.durationText, { color: colors.mutedForeground }]}>
                  {lesson.duration}
                </Text>
              </View>
            </View>

            <Text style={[styles.lessonTitle, { color: colors.foreground }]}>
              {lesson.title}
            </Text>

            {/* Render lesson content blocks */}
            {lesson.content.split("\n\n").map((block, i) => {
              if (!block.trim()) return null;

              // Table block
              if (block.startsWith("| ")) {
                const rows = block.split("\n").filter(
                  (r) => r.startsWith("|") && !r.match(/^\|[-| ]+\|$/)
                );
                return (
                  <View key={i} style={[styles.table, { borderColor: colors.border }]}>
                    {rows.map((row, ri) => {
                      const cells = row
                        .split("|")
                        .filter((c) => c.trim() !== "");
                      return (
                        <View
                          key={ri}
                          style={[
                            styles.tableRow,
                            {
                              borderBottomColor: colors.border,
                              backgroundColor: ri === 0 ? colors.secondary : "transparent",
                            },
                          ]}
                        >
                          {cells.map((cell, ci) => (
                            <Text
                              key={ci}
                              style={[
                                styles.tableCell,
                                {
                                  color: colors.foreground,
                                  fontFamily:
                                    ri === 0 ? "Geist_600SemiBold" : "Geist_400Regular",
                                  flex: ci === 0 ? 2 : 1,
                                },
                              ]}
                            >
                              {cell.trim()}
                            </Text>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                );
              }

              // Bullet list block
              if (block.includes("\n- ") || block.startsWith("- ")) {
                const lines = block.split("\n");
                return (
                  <View key={i} style={styles.bulletList}>
                    {lines.map((line, li) => {
                      if (line.startsWith("- ")) {
                        return (
                          <View key={li} style={styles.bulletItem}>
                            <View style={[styles.bullet, { backgroundColor: colors.accent }]} />
                            <Text style={[styles.bodyText, { color: colors.foreground }]}>
                              {line.slice(2)}
                            </Text>
                          </View>
                        );
                      }
                      if (line.trim()) {
                        return (
                          <Text key={li} style={[styles.bodyText, { color: colors.foreground }]}>
                            {line}
                          </Text>
                        );
                      }
                      return null;
                    })}
                  </View>
                );
              }

              // Bold heading block
              if (block.startsWith("**") && block.endsWith("**")) {
                return (
                  <Text key={i} style={[styles.blockHeading, { color: colors.foreground }]}>
                    {block.replace(/\*\*/g, "")}
                  </Text>
                );
              }

              // Mixed bold inline
              if (block.includes("**")) {
                const parts = block.split("**");
                return (
                  <Text key={i} style={[styles.bodyText, { color: colors.foreground }]}>
                    {parts.map((part, j) =>
                      j % 2 === 1 ? (
                        <Text key={j} style={styles.bold}>{part}</Text>
                      ) : (
                        <Text key={j}>{part}</Text>
                      )
                    )}
                  </Text>
                );
              }

              // Plain paragraph
              return (
                <Text key={i} style={[styles.bodyText, { color: colors.foreground }]}>
                  {block}
                </Text>
              );
            })}

            {/* ── Actions ── */}
            <View style={styles.actions}>
              {!lessonDone ? (
                <TouchableOpacity
                  style={[styles.completeBtn, { backgroundColor: colors.primary }]}
                  onPress={handleMarkComplete}
                  activeOpacity={0.85}
                >
                  <Feather name="check-circle" size={17} color="#FFFFFF" />
                  <Text style={styles.completeBtnText}>Mark as Complete</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.doneRow, { backgroundColor: "#EBF7E6", borderColor: "#5CB840" }]}>
                  <Feather name="check-circle" size={17} color="#5CB840" />
                  <Text style={[styles.doneText, { color: "#2A5129" }]}>Lesson completed</Text>
                </View>
              )}

              <View style={styles.navBtns}>
                <TouchableOpacity
                  style={[
                    styles.navBtn,
                    {
                      backgroundColor: activeLesson > 0 ? colors.secondary : colors.border,
                      borderColor: colors.border,
                      opacity: activeLesson > 0 ? 1 : 0.5,
                    },
                  ]}
                  onPress={goPrev}
                  disabled={activeLesson === 0}
                  activeOpacity={0.8}
                >
                  <Feather
                    name="chevron-left"
                    size={18}
                    color={activeLesson > 0 ? colors.primary : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.navBtnText,
                      { color: activeLesson > 0 ? colors.primary : colors.mutedForeground },
                    ]}
                  >
                    Previous
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.navBtn,
                    {
                      backgroundColor:
                        activeLesson < course.lessonList.length - 1
                          ? colors.primary
                          : colors.border,
                      borderColor: "transparent",
                      opacity: activeLesson < course.lessonList.length - 1 ? 1 : 0.5,
                    },
                  ]}
                  onPress={goNext}
                  disabled={activeLesson === course.lessonList.length - 1}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.navBtnText,
                      {
                        color:
                          activeLesson < course.lessonList.length - 1
                            ? "#FFFFFF"
                            : colors.mutedForeground,
                      },
                    ]}
                  >
                    Next Lesson
                  </Text>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={
                      activeLesson < course.lessonList.length - 1
                        ? "#FFFFFF"
                        : colors.mutedForeground
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    marginTop: 2,
    padding: 2,
  },
  headerInfo: { flex: 1 },
  headerCategory: {
    fontSize: 11,
    fontFamily: "Geist_500Medium",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Lora_700Bold",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  progressBar: {
    height: 3,
    width: "100%",
  },
  progressFill: {
    height: 3,
    backgroundColor: "#5CB840",
  },
  lessonSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  lessonSelectorLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lessonNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  lessonNumBadgeText: {
    fontSize: 12,
    fontFamily: "Geist_700Bold",
    color: "#FFFFFF",
  },
  lessonSelectorInfo: { flex: 1 },
  lessonSelectorMeta: {
    fontSize: 10,
    fontFamily: "Geist_400Regular",
    marginBottom: 2,
  },
  lessonSelectorTitle: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
  lessonDropdown: {
    borderBottomWidth: 1,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dropdownCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  dropdownNum: {
    fontSize: 11,
    fontFamily: "Geist_600SemiBold",
  },
  dropdownText: { flex: 1 },
  dropdownTitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  dropdownDuration: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
    marginTop: 2,
  },
  contentScroll: { flex: 1 },
  contentInner: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  durationText: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  lessonTitle: {
    fontSize: 22,
    fontFamily: "Lora_700Bold",
    lineHeight: 30,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: "Geist_400Regular",
    lineHeight: 24,
  },
  blockHeading: {
    fontSize: 16,
    fontFamily: "Geist_600SemiBold",
    lineHeight: 24,
    marginTop: 4,
  },
  bold: {
    fontFamily: "Geist_600SemiBold",
  },
  table: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tableCell: {
    fontSize: 13,
    lineHeight: 19,
    paddingRight: 8,
  },
  bulletList: {
    gap: 10,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 8,
    flexShrink: 0,
  },
  actions: {
    gap: 12,
    marginTop: 12,
  },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 14,
    paddingVertical: 15,
  },
  completeBtnText: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
    color: "#FFFFFF",
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
  },
  doneText: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
  },
  navBtns: {
    flexDirection: "row",
    gap: 10,
  },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    paddingVertical: 13,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
});
