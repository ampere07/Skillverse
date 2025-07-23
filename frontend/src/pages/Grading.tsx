import React from 'react';
import { Award } from 'lucide-react';

const GradingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Grading Interface</h1>
        <p className="text-gray-600">This feature is coming soon...</p>
      </div>
    </div>
  );
};

export default GradingPage;