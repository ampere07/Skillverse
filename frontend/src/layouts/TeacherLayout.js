import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  Home,
  Class,
  AddCircle,
  Grading,
  Analytics,
  Folder,
  Settings,
  Logout,
} from '@mui/icons-material';
import Sidebar from '../components/common/Sidebar';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import ManageClasses from '../pages/teacher/ManageClasses';
import CreateAssignment from '../pages/teacher/CreateAssignment';
import GradeSubmissions from '../pages/teacher/GradeSubmissions';
import StudentAnalytics from '../pages/teacher/StudentAnalytics';
import AssignmentBank from '../pages/teacher/AssignmentBank';

const SIDEBAR_WIDTH = 240;

const TeacherLayout = () => {
  const menuItems = [
    {
      label: 'Home',
      icon: <Home />,
      path: '/dashboard',
    },
    {
      label: 'Manage Classes',
      icon: <Class />,
      path: '/classes',
    },
    {
      label: 'Create Assignment',
      icon: <AddCircle />,
      path: '/assignments/create',
    },
    {
      label: 'Grade Submissions',
      icon: <Grading />,
      path: '/grading',
    },
    {
      label: 'Student Analytics',
      icon: <Analytics />,
      path: '/analytics',
    },
    {
      label: 'Assignment Bank',
      icon: <Folder />,
      path: '/assignment-bank',
    },
    {
      label: 'Settings',
      icon: <Settings />,
      path: '/settings',
    },
    {
      label: 'Logout',
      icon: <Logout />,
      action: 'logout',
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar menuItems={menuItems} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/dashboard" element={<TeacherDashboard />} />
            <Route path="/classes" element={<ManageClasses />} />
            <Route path="/assignments/create" element={<CreateAssignment />} />
            <Route path="/grading" element={<GradeSubmissions />} />
            <Route path="/grading/:assignmentId" element={<GradeSubmissions />} />
            <Route path="/analytics" element={<StudentAnalytics />} />
            <Route path="/assignment-bank" element={<AssignmentBank />} />
            <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherLayout;