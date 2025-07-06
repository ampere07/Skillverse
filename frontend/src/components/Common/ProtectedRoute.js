import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ children, requiredRole, component: Component }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center align-center" style={{ height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle both component prop and children
  if (Component) {
    return <Component />;
  }

  // If children is a function, call it with user context
  if (typeof children === 'function') {
    return children(user);
  }

  // For role-based redirection in dashboard
  if (children && typeof children === 'object' && children.type === Navigate) {
    const redirectPath = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;