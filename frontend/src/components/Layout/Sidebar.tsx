import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  Plus,
  GraduationCap,
  Code2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const teacherLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/classes', icon: Users, label: 'Classes' },
    { to: '/assignments', icon: FileText, label: 'Assignments' },
    { to: '/create-assignment', icon: Plus, label: 'Create Assignment' },
    { to: '/grading', icon: GraduationCap, label: 'Grading' },
  ];

  const studentLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/classes', icon: Users, label: 'My Classes' },
    { to: '/assignments', icon: FileText, label: 'Assignments' },
    { to: '/submissions', icon: Code2, label: 'My Submissions' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <div className="w-64 bg-white shadow-lg h-screen border-r border-gray-200">
      <div className="p-6">
        <div className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-gray-500">
          <Settings size={16} />
          <span className="text-sm">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;