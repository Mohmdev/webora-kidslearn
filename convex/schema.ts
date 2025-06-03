import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  courses: defineTable({
    title: v.string(),
    subject: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.string(),
    difficulty: v.string(), // "beginner", "intermediate", "advanced"
    ageRange: v.string(), // "6-8", "8-10", "10-12"
    totalLessons: v.number(),
    featured: v.boolean(),
  })
    .index("by_subject", ["subject"])
    .index("by_featured", ["featured"])
    .searchIndex("search_courses", {
      searchField: "title",
      filterFields: ["subject", "difficulty"],
    }),

  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    duration: v.number(), // in seconds
    order: v.number(),
    thumbnail: v.string(),
  }).index("by_course", ["courseId", "order"]),

  purchases: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    purchaseDate: v.number(),
    amount: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"])
    .index("by_user_course", ["userId", "courseId"]),

  progress: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
    watchTime: v.number(), // in seconds
    lastWatched: v.number(),
  })
    .index("by_user_course", ["userId", "courseId"])
    .index("by_user_lesson", ["userId", "lessonId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
