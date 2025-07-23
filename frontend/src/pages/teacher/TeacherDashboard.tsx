import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Fab,
  Chip,
  CircularProgress,
} from '@mui/material';
import { 
  Class, 
  Assignment, 
  Person, 
  Add,
  Pending,
  Analytics,
  School
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

interface DashboardData {
  classes: number;
  students: number;
  assignments: number;
  pendingSubmissions: Array<{
    _id: string;
    assignmentId: {
      title: string;
    };
    studentId: {
      name: string;
    };
    submittedAt: string;
  }>;
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/teacher/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hello, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome to your teacher dashboard. Manage your classes and track student progress.
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Class />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.classes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Classes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.students || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.assignments || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assignments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <Pending />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.pendingSubmissions?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Submissions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Submissions
              </Typography>
              {dashboardData?.pendingSubmissions && dashboardData.pendingSubmissions.length > 0 ? (
                <List>
                  {dashboardData.pendingSubmissions.slice(0, 5).map((submission, index) => (
                    <ListItem key={index} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={submission.assignmentId.title}
                        secondary={`${submission.studentId.name} • ${new Date(submission.submittedAt).toLocaleDateString()}`}
                      />
                      <Chip label="Pending" color="warning" size="small" />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No pending submissions.
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/grade">
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    component={Link}
                    to="/create-assignment"
                    fullWidth
                  >
                    Create Assignment
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    startIcon={<Class />}
                    component={Link}
                    to="/classes"
                    fullWidth
                  >
                    Manage Classes
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    startIcon={<Pending />}
                    component={Link}
                    to="/grade"
                    fullWidth
                  >
                    Grade Submissions
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    startIcon={<Analytics />}
                    component={Link}
                    to="/analytics"
                    fullWidth
                  >
                    View Analytics
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                <ListItem divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <School />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="New student joined CS101"
                    secondary="2 hours ago"
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Assignment />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Assignment 'Binary Search' was submitted"
                    secondary="4 hours ago"
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Student requested help with Data Structures"
                    secondary="1 day ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        component={Link}
        to="/create-assignment"
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default TeacherDashboard;