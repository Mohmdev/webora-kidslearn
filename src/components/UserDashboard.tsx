import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface UserDashboardProps {
  onNavigateToCourse: (courseId: string) => void;
}

export function UserDashboard({ onNavigateToCourse }: UserDashboardProps) {
  const user = useQuery(api.auth.loggedInUser);
  const purchases = useQuery(api.courses.getUserPurchases);

  if (!purchases || !user) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-200 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user.name || 'Learner'}! 🎉
            </h1>
            <p className="text-gray-600">Ready to continue your learning journey?</p>
          </div>
        </div>

        {purchases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{purchases.length}</div>
              <div className="text-purple-700 text-sm">Courses Purchased</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {purchases.reduce((total, purchase) => total + (purchase.course?.totalLessons || 0), 0)}
              </div>
              <div className="text-green-700 text-sm">Total Lessons Available</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">🏆</div>
              <div className="text-blue-700 text-sm">Keep Learning!</div>
            </div>
          </div>
        )}
      </div>

      {/* My Courses Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Courses 📚</h2>
        
        {purchases.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-200 text-center">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Courses Yet</h3>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <CourseCard 
                key={purchase._id} 
                purchase={purchase} 
                onNavigate={() => onNavigateToCourse(purchase.courseId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {purchases.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Learning Stats 📊</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{purchases.length}</div>
              <div className="text-sm text-gray-600">Courses Owned</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                ${purchases.reduce((total, purchase) => total + purchase.amount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Invested</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {new Set(purchases.map(p => p.course?.subject)).size}
              </div>
              <div className="text-sm text-gray-600">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">🌟</div>
              <div className="text-sm text-gray-600">Keep Going!</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({ purchase, onNavigate }: { purchase: any; onNavigate: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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
            onClick={onNavigate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}
