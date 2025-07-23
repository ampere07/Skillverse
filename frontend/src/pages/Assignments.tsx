import React from 'react';
import { useAuth } from '../context/AuthContext';
import AssignmentList from '../components/Student/AssignmentList';

const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'teacher') {
    // TODO: Implement teacher assignments view
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Assignments View</h1>
        <p className="text-gray-600 mt-2">Coming soon...</p>
      </div>
    );
  }

  return <AssignmentList />;
};

export default AssignmentsPage;