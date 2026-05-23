import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

  const course = courses.find((c) => c.id === id);
  const [activeLesson, setActiveLesson] = useState(0);

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

  const handleMarkComplete = async () => {
    if (!lesson) return;
    await markLessonComplete(course.id, lesson.id);
  };

  const goNext = () => {
    if (activeLesson < course.lessonList.length - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  const goPrev = () => {
    if (activeLesson > 0) {
      setActiveLesson(activeLesson - 1);
    }
  };

  const topPad = Platform.OS === "web" ? 0 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerCategory} numberOfLines={1}>
            {course.category} · {course.level}
          </Text>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {course.title}
          </Text>
        </View>
      </View>

      <View style={[styles.progressBar, { backgroundColor: colors.secondary }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: "#5CB840", width: `${progress}%` as any },
          ]}
        />
      </View>
      <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
        {progress}% complete · {course.lessonList.filter((_, i) => isLessonComplete(course.id, course.lessonList[i].id)).length}/{course.lessonList.length} lessons done
      </Text>

      <View style={styles.body}>
        <View style={[styles.sidebar, { borderRightColor: colors.border }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {course.lessonList.map((l, idx) => {
              const done = isLessonComplete(course.id, l.id);
              return (
                <TouchableOpacity
                  key={l.id}
                  style={[
                    styles.lessonTab,
                    {
                      backgroundColor: activeLesson === idx ? colors.secondary : "transparent",
                      borderLeftColor: activeLesson === idx ? colors.accent : "transparent",
                    },
                  ]}
                  onPress={() => setActiveLesson(idx)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.lessonCheck,
                    { backgroundColor: done ? "#5CB840" : colors.border },
                  ]}>
                    {done && <Feather name="check" size={10} color="#FFFFFF" />}
                  </View>
                  <Text
                    style={[
                      styles.lessonTabText,
                      {
                        color: activeLesson === idx ? colors.primary : colors.mutedForeground,
                        fontFamily: activeLesson === idx ? "Geist_600SemiBold" : "Geist_400Regular",
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {idx + 1}. {l.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.contentInner,
            { paddingBottom: Platform.OS === "web" ? 40 : insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {lesson && (
            <>
              <View style={styles.lessonHeader}>
                <Text style={[styles.lessonNum, { color: colors.mutedForeground }]}>
                  Lesson {activeLesson + 1} of {course.lessonList.length}
                </Text>
                <View style={styles.durationBadge}>
                  <Feather name="clock" size={11} color={colors.mutedForeground} />
                  <Text style={[styles.durationText, { color: colors.mutedForeground }]}>
                    {lesson.duration}
                  </Text>
                </View>
              </View>

              <Text style={[styles.lessonTitle, { color: colors.foreground }]}>
                {lesson.title}
              </Text>

              {lesson.content.split("\n\n").map((block, i) => {
                if (block.startsWith("**") && block.endsWith("**")) {
                  return (
                    <Text key={i} style={[styles.boldBlock, { color: colors.foreground }]}>
                      {block.replace(/\*\*/g, "")}
                    </Text>
                  );
                }
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
                if (block.startsWith("| ")) {
                  const rows = block.split("\n").filter((r) => r.startsWith("|") && !r.match(/^\|[-| ]+\|$/));
                  return (
                    <View key={i} style={[styles.table, { borderColor: colors.border }]}>
                      {rows.map((row, ri) => {
                        const cells = row.split("|").filter((c) => c.trim() !== "");
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
                                    fontFamily: ri === 0 ? "Geist_600SemiBold" : "Geist_400Regular",
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
                if (block.startsWith("- ") || block.includes("\n- ")) {
                  const lines = block.split("\n");
                  return (
                    <View key={i} style={styles.bulletList}>
                      {lines.map((line, li) => {
                        if (line.startsWith("- ")) {
                          return (
                            <View key={li} style={styles.bulletItem}>
                              <View style={[styles.bullet, { backgroundColor: colors.accent }]} />
                              <Text style={[styles.bulletText, { color: colors.foreground }]}>
                                {line.slice(2)}
                              </Text>
                            </View>
                          );
                        }
                        return (
                          <Text key={li} style={[styles.bodyText, { color: colors.foreground }]}>
                            {line}
                          </Text>
                        );
                      })}
                    </View>
                  );
                }
                return (
                  <Text key={i} style={[styles.bodyText, { color: colors.foreground }]}>
                    {block}
                  </Text>
                );
              })}

              <View style={styles.actions}>
                {!lessonDone ? (
                  <TouchableOpacity
                    style={[styles.completeBtn, { backgroundColor: colors.primary }]}
                    onPress={handleMarkComplete}
                    activeOpacity={0.85}
                  >
                    <Feather name="check-circle" size={16} color="#FFFFFF" />
                    <Text style={styles.completeBtnText}>Mark as Complete</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.doneRow, { backgroundColor: "#EBF7E6", borderColor: "#5CB840" }]}>
                    <Feather name="check-circle" size={16} color="#5CB840" />
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
                      },
                    ]}
                    onPress={goPrev}
                    disabled={activeLesson === 0}
                    activeOpacity={0.8}
                  >
                    <Feather name="chevron-left" size={18} color={activeLesson > 0 ? colors.primary : colors.mutedForeground} />
                    <Text style={[styles.navBtnText, { color: activeLesson > 0 ? colors.primary : colors.mutedForeground }]}>
                      Previous
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.navBtn,
                      {
                        backgroundColor: activeLesson < course.lessonList.length - 1 ? colors.primary : colors.border,
                        borderColor: "transparent",
                      },
                    ]}
                    onPress={goNext}
                    disabled={activeLesson === course.lessonList.length - 1}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.navBtnText, { color: activeLesson < course.lessonList.length - 1 ? "#FFFFFF" : colors.mutedForeground }]}>
                      Next
                    </Text>
                    <Feather name="chevron-right" size={18} color={activeLesson < course.lessonList.length - 1 ? "#FFFFFF" : colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Lora_700Bold",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  progressBar: {
    height: 4,
    width: "100%",
  },
  progressFill: {
    height: 4,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
    paddingHorizontal: 16,
    paddingVertical: 6,
    textAlign: "right",
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 130,
    borderRightWidth: 1,
  },
  lessonTab: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    borderLeftWidth: 3,
  },
  lessonCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  lessonTabText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  content: { flex: 1 },
  contentInner: {
    padding: 20,
    gap: 16,
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lessonNum: {
    fontSize: 11,
    fontFamily: "Geist_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  lessonTitle: {
    fontSize: 20,
    fontFamily: "Lora_700Bold",
    lineHeight: 28,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    lineHeight: 22,
  },
  boldBlock: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
    lineHeight: 22,
  },
  bold: {
    fontFamily: "Geist_600SemiBold",
  },
  table: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tableCell: {
    fontSize: 12,
    lineHeight: 18,
    paddingRight: 8,
  },
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    lineHeight: 22,
    flex: 1,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
  },
  completeBtnText: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
    color: "#FFFFFF",
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  doneText: {
    fontSize: 14,
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
    paddingVertical: 12,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
});
