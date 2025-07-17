import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, Chip } from '@mui/material';
import { 
  Dashboard, 
  School, 
  Assignment, 
  TrendingUp, 
  Insights, 
  Settings, 
  Logout 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../pages/student/StudentDashboard';
import MyClasses from '../pages/student/MyClasses';
import Assignments from '../pages/student/Assignments';
import CodeEditor from '../pages/student/CodeEditor';
import Progress from '../pages/student/Progress';
import SkillsReport from '../pages/student/SkillsReport';
import { Link, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { text: 'Home', icon: <Dashboard />, path: '/dashboard' },
    { text: 'My Classes', icon: <School />, path: '/classes' },
    { text: 'Assignments', icon: <Assignment />, path: '/assignments' },
    { text: 'My Progress', icon: <TrendingUp />, path: '/progress' },
    { text: 'Skills Report', icon: <Insights />, path: '/skills' },
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
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
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
          <Chip label="Student" color="primary" size="small" />
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
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
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
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/classes" element={<MyClasses />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/assignment/:id" element={<CodeEditor />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/skills" element={<SkillsReport />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default StudentLayout;