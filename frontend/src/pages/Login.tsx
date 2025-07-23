import React from 'react';
import { Code } from 'lucide-react';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Code className="h-10 w-10 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">SkillVerse</h1>
          </div>
          <p className="text-gray-600">Master Java Programming with Interactive Assignments</p>
        </div>
        
        <LoginForm />
        
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 SkillVerse. Empowering Java developers worldwide.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;