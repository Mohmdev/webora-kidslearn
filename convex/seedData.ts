import { mutation } from "./_generated/server";

export const seedCourses = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data
    const existingCourses = await ctx.db.query("courses").collect();
    for (const course of existingCourses) {
      await ctx.db.delete(course._id);
    }

    const existingLessons = await ctx.db.query("lessons").collect();
    for (const lesson of existingLessons) {
      await ctx.db.delete(lesson._id);
    }

    // Sample courses
    const courses = [
      {
        title: "Fun with Numbers: Basic Math Adventures",
        subject: "Math",
        description: "Learn counting, addition, and subtraction through exciting games and colorful animations. Perfect for young learners!",
        price: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop",
        difficulty: "beginner",
        ageRange: "6-8",
        totalLessons: 8,
        featured: true,
      },
      {
        title: "Amazing Physics for Kids",
        subject: "Physics",
        description: "Discover the wonders of physics through simple experiments and fun demonstrations. Learn about gravity, motion, and more!",
        price: 34.99,
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
        difficulty: "beginner",
        ageRange: "8-10",
        totalLessons: 10,
        featured: true,
      },
      {
        title: "Multiplication Magic",
        subject: "Math",
        description: "Master multiplication tables with magical tricks and memorable songs. Make math fun and easy!",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
        difficulty: "intermediate",
        ageRange: "8-10",
        totalLessons: 6,
        featured: true,
      },
      {
        title: "Science Experiments at Home",
        subject: "Science",
        description: "Safe and exciting science experiments you can do at home with everyday materials. Spark curiosity and wonder!",
        price: 39.99,
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
        difficulty: "intermediate",
        ageRange: "8-12",
        totalLessons: 12,
        featured: true,
      },
      {
        title: "Geometry Shapes & Patterns",
        subject: "Math",
        description: "Explore shapes, patterns, and spatial reasoning through interactive activities and visual learning.",
        price: 27.99,
        imageUrl: "https://images.unsplash.com/photo-1635070041409-e63e783d4d1e?w=400&h=300&fit=crop",
        difficulty: "intermediate",
        ageRange: "9-11",
        totalLessons: 7,
        featured: true,
      },
      {
        title: "Forces and Motion Adventures",
        subject: "Physics",
        description: "Learn about pushes, pulls, friction, and motion through hands-on activities and real-world examples.",
        price: 32.99,
        imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
        difficulty: "intermediate",
        ageRange: "9-12",
        totalLessons: 9,
        featured: false,
      },
    ];

    const courseIds = [];
    for (const course of courses) {
      const courseId = await ctx.db.insert("courses", course);
      courseIds.push(courseId);
    }

    // Sample lessons for each course
    const lessonsData = [
      // Fun with Numbers lessons
      [
        { title: "Counting to 10", description: "Learn to count from 1 to 10 with fun animations", duration: 300 },
        { title: "Number Recognition", description: "Identify and write numbers", duration: 420 },
        { title: "Simple Addition", description: "Adding numbers up to 10", duration: 480 },
        { title: "Simple Subtraction", description: "Taking away numbers", duration: 450 },
        { title: "Counting to 20", description: "Extend counting skills", duration: 360 },
        { title: "Number Patterns", description: "Find patterns in numbers", duration: 390 },
        { title: "Math Games", description: "Fun games to practice math", duration: 540 },
        { title: "Review and Practice", description: "Put it all together", duration: 600 },
      ],
      // Amazing Physics lessons
      [
        { title: "What is Physics?", description: "Introduction to the world of physics", duration: 240 },
        { title: "Gravity Experiments", description: "Why things fall down", duration: 360 },
        { title: "Push and Pull", description: "Understanding forces", duration: 300 },
        { title: "Rolling Objects", description: "How things move", duration: 420 },
        { title: "Floating and Sinking", description: "Why some things float", duration: 480 },
        { title: "Magnets are Magic", description: "Exploring magnetism", duration: 390 },
        { title: "Light and Shadows", description: "Playing with light", duration: 450 },
        { title: "Sound Waves", description: "How we hear things", duration: 360 },
        { title: "Simple Machines", description: "Tools that help us", duration: 540 },
        { title: "Physics All Around", description: "Physics in everyday life", duration: 300 },
      ],
    ];

    // Add lessons for first two courses
    for (let i = 0; i < 2; i++) {
      const lessons = lessonsData[i];
      for (let j = 0; j < lessons.length; j++) {
        await ctx.db.insert("lessons", {
          courseId: courseIds[i],
          title: lessons[j].title,
          description: lessons[j].description,
          videoUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_${j + 1}.mp4`,
          duration: lessons[j].duration,
          order: j + 1,
          thumbnail: `https://images.unsplash.com/photo-${1500000000000 + j}?w=300&h=200&fit=crop`,
        });
      }
    }

    // Add basic lessons for other courses
    for (let i = 2; i < courseIds.length; i++) {
      const course = courses[i];
      for (let j = 0; j < course.totalLessons; j++) {
        await ctx.db.insert("lessons", {
          courseId: courseIds[i],
          title: `Lesson ${j + 1}: ${course.title} Part ${j + 1}`,
          description: `Learn important concepts in ${course.subject.toLowerCase()}`,
          videoUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_${j + 1}.mp4`,
          duration: 300 + (j * 30),
          order: j + 1,
          thumbnail: `https://images.unsplash.com/photo-${1500000000000 + j}?w=300&h=200&fit=crop`,
        });
      }
    }

    return "Sample data created successfully!";
  },
});
