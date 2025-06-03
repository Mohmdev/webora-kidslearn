import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { CoursePage } from "./components/CoursePage";
import { UserDashboard } from "./components/UserDashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'course' | 'dashboard' | 'login'>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const user = useQuery(api.auth.loggedInUser);

  // Redirect authenticated users from login page
  useEffect(() => {
    if (user && currentPage === 'login') {
      navigateToDashboard();
    }
  }, [user, currentPage]);

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedCourseId(null);
  };

  const navigateToCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course');
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedCourseId(null);
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
    setSelectedCourseId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-purple-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={navigateToHome}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              🎓 Webora Uni
            </button>
            <nav className="hidden md:flex items-center gap-4">
              <button 
                onClick={navigateToHome}
                className={`px-4 py-2 rounded-full transition-all ${
                  currentPage === 'home' 
                    ? 'bg-purple-100 text-purple-700 font-medium' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                Browse Courses
              </button>
              {user && (
                <button 
                  onClick={navigateToDashboard}
                  className={`px-4 py-2 rounded-full transition-all ${
                    currentPage === 'dashboard' 
                      ? 'bg-purple-100 text-purple-700 font-medium' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  My Dashboard
                </button>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <SignOutButton />
            ) : (
              <button
                onClick={navigateToLogin}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Public pages - no authentication required */}
        {currentPage === 'home' && (
          <HomePage 
            onNavigateToCourse={navigateToCourse}
            onNavigateToLogin={navigateToLogin}
          />
        )}
        
        {currentPage === 'course' && selectedCourseId && (
          <CoursePage 
            courseId={selectedCourseId} 
            onNavigateBack={navigateToHome}
            onNavigateToLogin={navigateToLogin}
          />
        )}

        {/* Login page */}
        {currentPage === 'login' && !user && (
          <div className="max-w-md mx-auto mt-16 px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Welcome Back! <span className="text-2xl">🌟</span>
              </h1>
              <p className="text-lg text-gray-600">
                Sign in to access your purchased courses and track your progress
              </p>
            </div>
            <SignInForm />
            <div className="text-center mt-6">
              <button
                onClick={navigateToHome}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                ← Continue browsing courses
              </button>
            </div>
          </div>
        )}

        {/* Protected pages - authentication required */}
        {currentPage === 'dashboard' && user && (
          <UserDashboard onNavigateToCourse={navigateToCourse} />
        )}
      </main>

      <footer className="bg-white border-t border-purple-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 KidsLearn. Making learning fun for elementary school children! 🎈
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
