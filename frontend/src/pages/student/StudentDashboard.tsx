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
  Paper,
  Stack,
  Divider,
  IconButton,
  Badge,
  Alert,
  AlertTitle,
} from '@mui/material';
import { 
  Assignment,
  TrendingUp,
  Schedule,
  Star,
  School,
  Code,
  CheckCircle,
  ArrowForward,
  Notifications,
  Update,
  EmojiEvents,
  Speed,
  BookmarkBorder,
  PlayArrow,
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
      code: string;
    };
    status: 'not_started' | 'in_progress' | 'completed';
    priority: 'high' | 'medium' | 'low';
  }>;
  recentGrades: Array<{
    assignmentId: {
      title: string;
      totalPoints: number;
    };
    grade: number;
    feedback: string;
    gradedAt: string;
  }>;
  weeklyProgress: Array<{
    day: string;
    completed: number;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'in_progress': return <Update sx={{ color: 'warning.main' }} />;
      default: return <PlayArrow sx={{ color: 'action.active' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Ready to continue your learning journey?
            </Typography>
          </Box>
        </Stack>

        {/* Quick Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<Code />}
            component={Link}
            to="/code-editor"
            sx={{ borderRadius: 3 }}
          >
            Start Coding
          </Button>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            component={Link}
            to="/assignments"
            sx={{ borderRadius: 3 }}
          >
            View Assignments
          </Button>
          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            component={Link}
            to="/progress"
            sx={{ borderRadius: 3 }}
          >
            Track Progress
          </Button>
        </Stack>
      </Box>

      {/* Urgent Assignments Alert */}
      {dashboardData?.dueThisWeek && dashboardData.dueThisWeek.filter(a => a.priority === 'high').length > 0 && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button size="small" component={Link} to="/assignments">
              View All
            </Button>
          }
        >
          <AlertTitle>Assignments Due Soon</AlertTitle>
          You have {dashboardData.dueThisWeek.filter(a => a.priority === 'high').length} high-priority assignments due this week.
        </Alert>
      )}

      {/* Quick Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {dashboardData?.classes || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Active Classes
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {dashboardData?.completedAssignments || 0}/{dashboardData?.totalAssignments || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Completed
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {dashboardData?.averageGrade || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Average Grade
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {dashboardData?.dueThisWeek?.length || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Due This Week
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Assignments */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    📚 Upcoming Assignments
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Stay on top of your coursework
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/assignments"
                  sx={{ borderRadius: 3 }}
                >
                  View All
                </Button>
              </Stack>

              {dashboardData?.dueThisWeek && dashboardData.dueThisWeek.length > 0 ? (
                <Stack spacing={2}>
                  {dashboardData.dueThisWeek.slice(0, 4).map((assignment, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                        },
                      })}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'background.paper', border: '2px solid', borderColor: 'divider' }}>
                          {getStatusIcon(assignment.status)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {assignment.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            {assignment.classId.name} • Due {new Date(assignment.dueDate).toLocaleDateString()}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={assignment.priority}
                              size="small"
                              color={getPriorityColor(assignment.priority) as any}
                              sx={{ textTransform: 'capitalize' }}
                            />
                            <Chip
                              label={assignment.status.replace('_', ' ')}
                              size="small"
                              variant="outlined"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </Stack>
                        </Box>
                        <IconButton
                          component={Link}
                          to={`/assignment/${assignment._id}`}
                          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                          <ArrowForward />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    All caught up! 🎉
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No assignments due this week. Great job staying on track!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity & Achievements */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Recent Grades */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                  ⭐ Recent Grades
                </Typography>
                {dashboardData?.recentGrades && dashboardData.recentGrades.length > 0 ? (
                  <Stack spacing={2}>
                    {dashboardData.recentGrades.slice(0, 3).map((grade, index) => (
                      <Box key={index}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {grade.assignmentId.title}
                          </Typography>
                          <Chip
                            label={`${Math.round((grade.grade / grade.assignmentId.totalPoints) * 100)}%`}
                            size="small"
                            color={
                              grade.grade >= 90 ? 'success' :
                              grade.grade >= 80 ? 'warning' : 'error'
                            }
                            sx={{ fontWeight: 600 }}
                          />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={(grade.grade / grade.assignmentId.totalPoints) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              background: grade.grade >= 90 
                                ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
                                : grade.grade >= 80
                                ? 'linear-gradient(90deg, #ff9800, #ffb74d)'
                                : 'linear-gradient(90deg, #f44336, #e57373)',
                            },
                          }}
                        />
                        {index < dashboardData.recentGrades.length - 1 && <Divider sx={{ mt: 2 }} />}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                    Complete assignments to see your grades here
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🚀 Quick Actions
                </Typography>
                <Stack spacing={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Code />}
                    component={Link}
                    to="/code-editor"
                    sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                  >
                    Open Code Editor
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Assignment />}
                    component={Link}
                    to="/assignments"
                    sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                  >
                    Browse Assignments
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<School />}
                    component={Link}
                    to="/classes"
                    sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                  >
                    Join New Class
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                📈 Learning Progress
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Assignment Completion Rate
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {dashboardData?.completedAssignments || 0} of {dashboardData?.totalAssignments || 0} completed
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={
                        dashboardData?.totalAssignments 
                          ? (dashboardData.completedAssignments / dashboardData.totalAssignments) * 100 
                          : 0
                      }
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      startIcon={<TrendingUp />}
                      component={Link}
                      to="/progress"
                      sx={{ borderRadius: 3 }}
                    >
                      Detailed Progress
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Speed />}
                      component={Link}
                      to="/skills"
                      sx={{ borderRadius: 3 }}
                    >
                      Skills Report
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
