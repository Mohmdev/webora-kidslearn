import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface MyCoursesPageProps {
  onNavigateToCourse: (courseId: string) => void;
}

export function MyCoursesPage({ onNavigateToCourse }: MyCoursesPageProps) {
  const purchases = useQuery(api.courses.getUserPurchases);

  if (!purchases) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-200">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Courses Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't purchased any courses yet. Browse our amazing collection of educational content!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Browse Courses 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          My Learning Journey 🎓
        </h1>
        <p className="text-xl text-gray-600">
          Continue your amazing learning adventure! You have {purchases.length} course{purchases.length !== 1 ? 's' : ''} to explore.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map((purchase) => (
          <div key={purchase._id} className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <img 
                src={purchase.course?.imageUrl} 
                alt={purchase.course?.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Purchased
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {purchase.course?.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {purchase.course?.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>📹 {purchase.course?.totalLessons} lessons</span>
                  <span>👶 Ages {purchase.course?.ageRange}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Purchased {new Date(purchase.purchaseDate).toLocaleDateString()}
                </div>
                <button
                  onClick={() => onNavigateToCourse(purchase.courseId)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
