export type Course = {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  lessons: number;
  imageKey: string;
};

export const courses: Course[] = [
  {
    id: "1",
    title: "Modern Poultry Farming Fundamentals",
    instructor: "Dr. Adewale Okafor",
    duration: "4h 30min",
    level: "Beginner",
    category: "Poultry",
    lessons: 12,
    imageKey: "poultry",
  },
  {
    id: "2",
    title: "Soil Health & Crop Nutrition",
    instructor: "Prof. Ngozi Eze",
    duration: "6h 15min",
    level: "Intermediate",
    category: "Crop Farming",
    lessons: 18,
    imageKey: "soil",
  },
  {
    id: "3",
    title: "Farm Financial Management",
    instructor: "Musa Aliyu",
    duration: "3h 00min",
    level: "Beginner",
    category: "Business",
    lessons: 9,
    imageKey: "finance",
  },
  {
    id: "4",
    title: "Integrated Pest Management",
    instructor: "Dr. Fatima Bello",
    duration: "5h 45min",
    level: "Advanced",
    category: "Crop Farming",
    lessons: 15,
    imageKey: "pest",
  },
  {
    id: "5",
    title: "Livestock Health & Disease Prevention",
    instructor: "Dr. Emmanuel Obi",
    duration: "4h 00min",
    level: "Intermediate",
    category: "Livestock",
    lessons: 11,
    imageKey: "livestock",
  },
  {
    id: "6",
    title: "Agricultural Market Strategies",
    instructor: "Amaka Chibuike",
    duration: "2h 30min",
    level: "Intermediate",
    category: "Business",
    lessons: 8,
    imageKey: "market",
  },
];

export const featuredCourses = courses.slice(0, 3);
