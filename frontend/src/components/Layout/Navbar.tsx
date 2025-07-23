import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Code } from 'lucide-react';
import Button from '../Common/Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-gray-900">SkillVerse</span>
            </div>
            <div className="hidden md:block">
              <span className="text-sm text-gray-500">Java Programming Platform</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
              className="ml-2"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;