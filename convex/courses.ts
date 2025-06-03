import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getFeaturedCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
  },
});

export const getAllCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const searchCourses = query({
  args: { 
    searchTerm: v.string(),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("courses")
      .withSearchIndex("search_courses", (q) => 
        q.search("title", args.searchTerm)
      );
    
    if (args.subject) {
      query = query.filter((q) => q.eq(q.field("subject"), args.subject));
    }
    
    return await query.collect();
  },
});

export const getCourseById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courseId);
  },
});

export const getCourseLessons = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const checkUserAccess = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_user_course", (q) => 
        q.eq("userId", userId).eq("courseId", args.courseId)
      )
      .first();

    return !!purchase;
  },
});

export const getUserProgress = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("progress")
      .withIndex("by_user_course", (q) => 
        q.eq("userId", userId).eq("courseId", args.courseId)
      )
      .collect();
  },
});

export const markLessonComplete = mutation({
  args: { 
    courseId: v.id("courses"),
    lessonId: v.id("lessons"),
    watchTime: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", userId).eq("lessonId", args.lessonId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: true,
        watchTime: args.watchTime,
        lastWatched: Date.now(),
      });
    } else {
      await ctx.db.insert("progress", {
        userId,
        courseId: args.courseId,
        lessonId: args.lessonId,
        completed: true,
        watchTime: args.watchTime,
        lastWatched: Date.now(),
      });
    }
  },
});

export const purchaseCourse = mutation({
  args: { 
    courseId: v.id("courses"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    // Check if already purchased
    const existing = await ctx.db
      .query("purchases")
      .withIndex("by_user_course", (q) => 
        q.eq("userId", userId).eq("courseId", args.courseId)
      )
      .first();

    if (existing) {
      throw new Error("Course already purchased");
    }

    await ctx.db.insert("purchases", {
      userId,
      courseId: args.courseId,
      purchaseDate: Date.now(),
      amount: args.amount,
    });
  },
});

export const getUserPurchases = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const coursesWithPurchases = await Promise.all(
      purchases.map(async (purchase) => {
        const course = await ctx.db.get(purchase.courseId);
        return { ...purchase, course };
      })
    );

    return coursesWithPurchases;
  },
});
