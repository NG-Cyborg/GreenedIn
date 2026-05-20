import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { Course } from "@/constants/courses";
import { useColors } from "@/hooks/useColors";

type Props = {
  course: Course;
  onPress?: () => void;
};

const LEVEL_COLORS: Record<Course["level"], string> = {
  Beginner: "#22A55A",
  Intermediate: "#F59E0B",
  Advanced: "#E53935",
};

export function CourseCard({ course, onPress }: Props) {
  const colors = useColors();

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
          styles.imagePlaceholder,
          { backgroundColor: colors.secondary },
        ]}
      >
        <Feather name="book-open" size={28} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <View style={styles.row}>
          <Text
            style={[
              styles.level,
              { color: LEVEL_COLORS[course.level] },
            ]}
          >
            {course.level}
          </Text>
          <Text style={[styles.category, { color: colors.mutedForeground }]}>
            {course.category}
          </Text>
        </View>
        <Text
          style={[styles.title, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {course.title}
        </Text>
        <Text style={[styles.instructor, { color: colors.mutedForeground }]}>
          {course.instructor}
        </Text>
        <View style={styles.meta}>
          <Feather name="clock" size={11} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {course.duration}
          </Text>
          <Feather name="layers" size={11} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {course.lessons} lessons
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  level: {
    fontSize: 10,
    fontFamily: "Geist_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  category: {
    fontSize: 10,
    fontFamily: "Geist_400Regular",
  },
  title: {
    fontSize: 13,
    fontFamily: "Lora_600SemiBold",
    lineHeight: 18,
  },
  instructor: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 10,
    fontFamily: "Geist_400Regular",
    marginRight: 4,
  },
});
