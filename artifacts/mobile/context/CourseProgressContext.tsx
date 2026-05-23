import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ProgressMap = Record<string, Record<string, boolean>>;

type CourseProgressContextType = {
  completedLessons: ProgressMap;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
  getCourseProgress: (courseId: string, totalLessons: number) => number;
  isLessonComplete: (courseId: string, lessonId: string) => boolean;
};

const CourseProgressContext = createContext<CourseProgressContextType | null>(null);
const STORAGE_KEY = "@greenedin_course_progress";

export function CourseProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedLessons, setCompletedLessons] = useState<ProgressMap>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setCompletedLessons(JSON.parse(data));
    });
  }, []);

  const persist = useCallback(async (map: ProgressMap) => {
    setCompletedLessons(map);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }, []);

  const markLessonComplete = useCallback(
    async (courseId: string, lessonId: string) => {
      const updated = {
        ...completedLessons,
        [courseId]: {
          ...(completedLessons[courseId] || {}),
          [lessonId]: true,
        },
      };
      await persist(updated);
    },
    [completedLessons, persist]
  );

  const getCourseProgress = useCallback(
    (courseId: string, totalLessons: number) => {
      if (totalLessons === 0) return 0;
      const done = Object.values(completedLessons[courseId] || {}).filter(Boolean).length;
      return Math.round((done / totalLessons) * 100);
    },
    [completedLessons]
  );

  const isLessonComplete = useCallback(
    (courseId: string, lessonId: string) => {
      return !!(completedLessons[courseId]?.[lessonId]);
    },
    [completedLessons]
  );

  return (
    <CourseProgressContext.Provider
      value={{ completedLessons, markLessonComplete, getCourseProgress, isLessonComplete }}
    >
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  const ctx = useContext(CourseProgressContext);
  if (!ctx) throw new Error("useCourseProgress must be used within CourseProgressProvider");
  return ctx;
}
