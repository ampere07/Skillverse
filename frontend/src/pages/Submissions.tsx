import React from 'react';
import { FileText } from 'lucide-react';

const SubmissionsPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Submissions</h1>
        <p className="text-gray-600">This feature is coming soon...</p>
      </div>
    </div>
  );
};

export default SubmissionsPage;