import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { 
  Assignment, 
  TrendingUp, 
  Schedule,
  Star,
  School
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

interface DashboardData {
  classes: number;
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  dueThisWeek: Array<{
    _id: string;
    title: string;
    dueDate: string;
    classId: {
      name: string;
    };
  }>;
  recentGrades: Array<{
    assignmentId: {
      title: string;
      totalPoints: number;
    };
    grade: number;
  }>;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/student/dashboard');
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
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Here's your learning progress and upcoming assignments
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.classes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Classes Joined
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.completedAssignments || 0}/{dashboardData?.totalAssignments || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assignments Done
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.averageGrade || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Grade
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.dueThisWeek?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due This Week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Due This Week */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Due This Week
              </Typography>
              {dashboardData?.dueThisWeek && dashboardData.dueThisWeek.length > 0 ? (
                <List>
                  {dashboardData.dueThisWeek.map((assignment, index) => (
                    <ListItem key={index} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`${assignment.classId.name} • Due ${new Date(assignment.dueDate).toLocaleDateString()}`}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        to={`/assignment/${assignment._id}`}
                      >
                        Start
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No assignments due this week. Great job staying on top of your work!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Grades */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Grades
              </Typography>
              {dashboardData?.recentGrades && dashboardData.recentGrades.length > 0 ? (
                <List>
                  {dashboardData.recentGrades.map((grade, index) => (
                    <ListItem key={index} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: grade.grade >= 90 ? 'success.main' : 
                                  grade.grade >= 80 ? 'warning.main' : 'error.main' 
                        }}>
                          <Star />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={grade.assignmentId.title}
                        secondary={`${grade.grade}/${grade.assignmentId.totalPoints} points`}
                      />
                      <Chip
                        label={`${Math.round((grade.grade / grade.assignmentId.totalPoints) * 100)}%`}
                        color={
                          grade.grade >= 90 ? 'success' :
                          grade.grade >= 80 ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No grades available yet. Complete some assignments to see your progress!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Assignment Completion</Typography>
                  <Typography variant="body2">
                    {dashboardData?.completedAssignments || 0} / {dashboardData?.totalAssignments || 0}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    dashboardData?.totalAssignments 
                      ? (dashboardData.completedAssignments / dashboardData.totalAssignments) * 100 
                      : 0
                  }
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/assignments"
                  startIcon={<Assignment />}
                >
                  View All Assignments
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/progress"
                  startIcon={<TrendingUp />}
                >
                  View Progress Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;