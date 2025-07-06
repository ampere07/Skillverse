import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const teacherLinks = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/teacher/create-class', label: 'Create Class', icon: '🏫' },
    { path: '/teacher/create-assignment', label: 'Create Assignment', icon: '📝' },
  ];

  const studentLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/student/join-class', label: 'Join Class', icon: '🚪' },
    { path: '/student/assignments', label: 'Assignments', icon: '📋' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {user?.role === 'teacher' ? 'Teacher Panel' : 'Student Panel'}
        </h2>
        
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(link.path)
                  ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;