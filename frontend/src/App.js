import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import CreateClass from './components/Teacher/CreateClass';
import CreateAssignment from './components/Teacher/CreateAssignment';
import ViewSubmissions from './components/Teacher/ViewSubmissions';
import JoinClass from './components/Student/JoinClass';
import AssignmentList from './components/Student/AssignmentList';
import CodeEditor from './components/Student/CodeEditor';
import ProtectedRoute from './components/Common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardRoute />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="teacher/*"
                  element={
                    <ProtectedRoute requiredRole="teacher">
                      <TeacherRoutes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="student/*"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentRoutes />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

function DashboardRoute() {
  return <ProtectedRoute component={DashboardRedirect} />;
}

function DashboardRedirect() {
  // This component will be rendered within ProtectedRoute
  // The user context will be available here
  return <Navigate to="/teacher/dashboard" replace />;
}

function TeacherRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="create-class" element={<CreateClass />} />
      <Route path="create-assignment" element={<CreateAssignment />} />
      <Route path="submissions/:assignmentId" element={<ViewSubmissions />} />
    </Routes>
  );
}

function StudentRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="join-class" element={<JoinClass />} />
      <Route path="assignments" element={<AssignmentList />} />
      <Route path="assignment/:assignmentId" element={<CodeEditor />} />
    </Routes>
  );
}

export default App;