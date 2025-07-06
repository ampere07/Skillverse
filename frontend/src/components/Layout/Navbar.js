import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SkillVerse</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              
              {user.role === 'teacher' && (
                <>
                  <Link
                    to="/teacher/create-class"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Create Class
                  </Link>
                  <Link
                    to="/teacher/create-assignment"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Create Assignment
                  </Link>
                </>
              )}
              
              {user.role === 'student' && (
                <>
                  <Link
                    to="/student/join-class"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Join Class
                  </Link>
                  <Link
                    to="/student/assignments"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Assignments
                  </Link>
                </>
              )}
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user.name}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {user && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              
              {user.role === 'teacher' && (
                <>
                  <Link
                    to="/teacher/create-class"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Class
                  </Link>
                  <Link
                    to="/teacher/create-assignment"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Assignment
                  </Link>
                </>
              )}
              
              {user.role === 'student' && (
                <>
                  <Link
                    to="/student/join-class"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Class
                  </Link>
                  <Link
                    to="/student/assignments"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Assignments
                  </Link>
                </>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;