import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, Chip } from '@mui/material';
import { 
  Dashboard, 
  Class, 
  AddCircle, 
  Grading, 
  Analytics, 
  Folder, 
  Settings, 
  Logout 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import ManageClasses from '../pages/teacher/ManageClasses';
import CreateAssignment from '../pages/teacher/CreateAssignment';
import GradeSubmissions from '../pages/teacher/GradeSubmissions';
import StudentAnalytics from '../pages/teacher/StudentAnalytics';
import AssignmentBank from '../pages/teacher/AssignmentBank';
import { Link, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const TeacherLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { text: 'Home', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Manage Classes', icon: <Class />, path: '/classes' },
    { text: 'Create Assignment', icon: <AddCircle />, path: '/create-assignment' },
    { text: 'Grade Submissions', icon: <Grading />, path: '/grade' },
    { text: 'Student Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Assignment Bank', icon: <Folder />, path: '/assignment-bank' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            SkillVerse
          </Typography>
        </Box>
        
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Chip label="Teacher" color="secondary" size="small" />
        </Box>

        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'secondary.light',
                  color: 'secondary.contrastText',
                  '&:hover': {
                    bgcolor: 'secondary.light',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'secondary.contrastText' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/dashboard" element={<TeacherDashboard />} />
          <Route path="/classes" element={<ManageClasses />} />
          <Route path="/create-assignment" element={<CreateAssignment />} />
          <Route path="/grade" element={<GradeSubmissions />} />
          <Route path="/analytics" element={<StudentAnalytics />} />
          <Route path="/assignment-bank" element={<AssignmentBank />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default TeacherLayout;