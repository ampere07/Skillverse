import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  Home,
  School,
  Assignment,
  TrendingUp,
  Insights,
  Settings,
  Logout,
} from '@mui/icons-material';
import Sidebar from '../components/common/Sidebar';
import StudentDashboard from '../pages/student/StudentDashboard';
import MyClasses from '../pages/student/MyClasses';
import Assignments from '../pages/student/Assignments';
import CodeEditor from '../pages/student/CodeEditor';
import Progress from '../pages/student/Progress';
import SkillsReport from '../pages/student/SkillsReport';

const SIDEBAR_WIDTH = 240;

const StudentLayout = () => {
  const menuItems = [
    {
      label: 'Home',
      icon: <Home />,
      path: '/dashboard',
    },
    {
      label: 'My Classes',
      icon: <School />,
      path: '/classes',
    },
    {
      label: 'Assignments',
      icon: <Assignment />,
      path: '/assignments',
    },
    {
      label: 'My Progress',
      icon: <TrendingUp />,
      path: '/progress',
    },
    {
      label: 'Skills Report',
      icon: <Insights />,
      path: '/skills',
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
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/classes" element={<MyClasses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/assignments/:id/code" element={<CodeEditor />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/skills" element={<SkillsReport />} />
            <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentLayout;