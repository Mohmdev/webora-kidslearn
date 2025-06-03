import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

interface HomePageProps {
  onNavigateToCourse: (courseId: string) => void;
  onNavigateToLogin: () => void;
}

export function HomePage({ onNavigateToCourse, onNavigateToLogin }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  
  const featuredCourses = useQuery(api.courses.getFeaturedCourses);
  const allCourses = useQuery(api.courses.getAllCourses);
  const searchResults = useQuery(
    api.courses.searchCourses, 
    searchTerm.length > 0 ? { searchTerm, subject: selectedSubject || undefined } : "skip"
  );
  
  const seedData = useMutation(api.seedData.seedCourses);

  const displayCourses = searchTerm.length > 0 ? searchResults : featuredCourses;
  const subjects = ["Math", "Physics", "Science"];

  const handleSeedData = async () => {
    try {
      await seedData({});
      toast.success("Sample courses loaded successfully!");
    } catch (error) {
      toast.error("Failed to load sample data");
    }
  };

  if (!allCourses) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (allCourses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to KidsLearn! 🎓</h2>
          <p className="text-gray-600 mb-6">
            Let's get started by loading some sample courses for you to explore.
          </p>
          <button
            onClick={handleSeedData}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Load Sample Courses 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Fun Learning Adventures! 🌟
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover amazing video courses designed specifically for elementary school children. 
          Learn math, science, and physics through engaging activities and colorful animations!
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-lg mx-auto">
          <p className="text-yellow-700 text-sm">
            🎉 Browse all courses freely! Sign in only when you're ready to purchase and start learning.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200 mb-12">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search for courses... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {searchTerm ? `Search Results (${displayCourses?.length || 0})` : "Featured Courses 🌟"}
        </h2>
        
        {displayCourses && displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((course) => (
              <CourseCard 
                key={course._id} 
                course={course} 
                onNavigate={() => onNavigateToCourse(course._id)}
                onNavigateToLogin={onNavigateToLogin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search terms or browse all courses</p>
          </div>
        )}
      </div>

      {/* All Courses Section */}
      {!searchTerm && allCourses && allCourses.length > (featuredCourses?.length || 0) && (
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">All Courses 📚</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses
              .filter(course => !course.featured)
              .map((course) => (
                <CourseCard 
                  key={course._id} 
                  course={course} 
                  onNavigate={() => onNavigateToCourse(course._id)}
                  onNavigateToLogin={onNavigateToLogin}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, onNavigate, onNavigateToLogin }: { 
  course: any; 
  onNavigate: () => void;
  onNavigateToLogin: () => void;
}) {
  const subjectEmojis: Record<string, string> = {
    Math: "🔢",
    Physics: "⚡",
    Science: "🔬",
  };

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={course.imageUrl} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {subjectEmojis[course.subject]} {course.subject}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[course.difficulty]}`}>
            {course.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>📹 {course.totalLessons} lessons</span>
            <span>👶 Ages {course.ageRange}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-purple-600">
            ${course.price}
          </div>
          <button
            onClick={onNavigate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
