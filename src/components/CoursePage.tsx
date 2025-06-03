import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { Authenticated, Unauthenticated } from "convex/react";

interface CoursePageProps {
  courseId: string;
  onNavigateBack: () => void;
  onNavigateToLogin: () => void;
}

export function CoursePage({ courseId, onNavigateBack, onNavigateToLogin }: CoursePageProps) {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const course = useQuery(api.courses.getCourseById, { courseId: courseId as Id<"courses"> });
  const lessons = useQuery(api.courses.getCourseLessons, { courseId: courseId as Id<"courses"> });
  
  // These queries only run when authenticated
  const hasAccess = useQuery(api.courses.checkUserAccess, { courseId: courseId as Id<"courses"> });
  const userProgress = useQuery(api.courses.getUserProgress, { courseId: courseId as Id<"courses"> });
  
  const purchaseCourse = useMutation(api.courses.purchaseCourse);
  const markComplete = useMutation(api.courses.markLessonComplete);

  if (!course || !lessons) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const currentLesson = lessons[selectedLessonIndex];
  const completedLessons = userProgress?.filter(p => p.completed).length || 0;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const handlePurchase = async () => {
    try {
      await purchaseCourse({ 
        courseId: courseId as Id<"courses">, 
        amount: course.price 
      });
      toast.success("🎉 Course purchased successfully! Welcome to your learning journey!");
      setShowPurchaseModal(false);
    } catch (error) {
      toast.error("Purchase failed. Please try again.");
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLesson || !hasAccess) return;
    
    try {
      await markComplete({
        courseId: courseId as Id<"courses">,
        lessonId: currentLesson._id,
        watchTime: currentLesson.duration,
      });
      toast.success("✅ Lesson completed! Great job!");
    } catch (error) {
      toast.error("Failed to mark lesson as complete");
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress?.some(p => p.lessonId === lessonId && p.completed) || false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
        >
          ← Back to Courses
        </button>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
          <div className="flex flex-col lg:flex-row gap-6">
            <img 
              src={course.imageUrl} 
              alt={course.title}
              className="w-full lg:w-80 h-48 object-cover rounded-xl"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {course.subject}
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Ages {course.ageRange}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {course.totalLessons} lessons
                </span>
              </div>

              <Authenticated>
                {hasAccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-700 font-medium">Your Progress</span>
                      <span className="text-green-600 text-sm">{completedLessons}/{lessons.length} completed</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-purple-600">${course.price}</div>
                    <button
                      onClick={() => setShowPurchaseModal(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Purchase Course 🛒
                    </button>
                  </div>
                )}
              </Authenticated>

              <Unauthenticated>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">${course.price}</div>
                      <p className="text-blue-700 text-sm">Sign in to purchase and start learning!</p>
                    </div>
                    <button
                      onClick={onNavigateToLogin}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Sign In to Purchase
                    </button>
                  </div>
                </div>
              </Unauthenticated>
            </div>
          </div>
        </div>
      </div>

      <Authenticated>
        {hasAccess ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-xl font-semibold mb-2">{currentLesson?.title}</h3>
                    <p className="text-gray-300 mb-4">{currentLesson?.description}</p>
                    <div className="text-sm text-gray-400">
                      Duration: {Math.floor((currentLesson?.duration || 0) / 60)}:{String((currentLesson?.duration || 0) % 60).padStart(2, '0')}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{currentLesson?.title}</h2>
                    {isLessonCompleted(currentLesson?._id || '') ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        ✅ Completed
                      </span>
                    ) : (
                      <button
                        onClick={handleMarkComplete}
                        className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600">{currentLesson?.description}</p>
                </div>
              </div>
            </div>

            {/* Lesson List */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson._id}
                    onClick={() => setSelectedLessonIndex(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedLessonIndex === index
                        ? 'bg-purple-100 border-2 border-purple-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">
                          {lesson.order}. {lesson.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                        </div>
                      </div>
                      {isLessonCompleted(lesson._id) && (
                        <div className="text-green-500 text-sm">✅</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <CoursePreview course={course} lessons={lessons} onPurchase={() => setShowPurchaseModal(true)} />
        )}
      </Authenticated>

      <Unauthenticated>
        <CoursePreview course={course} lessons={lessons} onPurchase={onNavigateToLogin} />
      </Unauthenticated>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Purchase Course</h3>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">{course.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="text-3xl font-bold text-purple-600 mb-4">${course.price}</div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-700 text-sm">
                  🎉 This is a demo purchase. No real payment will be processed.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Purchase Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CoursePreview({ course, lessons, onPurchase }: { 
  course: any; 
  lessons: any[]; 
  onPurchase: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-8 text-center">
      <div className="text-6xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Preview</h2>
      <p className="text-gray-600 mb-6">
        Purchase this course to access all {course.totalLessons} video lessons and track your progress!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {lessons.slice(0, 3).map((lesson, index) => (
          <div key={lesson._id} className="bg-gray-50 rounded-xl p-4">
            <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
              <div className="text-gray-400 text-2xl">🎬</div>
            </div>
            <h4 className="font-medium text-gray-800 text-sm">{lesson.title}</h4>
            <p className="text-xs text-gray-500 mt-1">
              {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>
      {lessons.length > 3 && (
        <p className="text-gray-500 mb-6">+ {lessons.length - 3} more lessons</p>
      )}
      <button
        onClick={onPurchase}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
      >
        Get Access Now - ${course.price}
      </button>
    </div>
  );
}
