import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Paper,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  School,
  Assignment,
  People,
  TrendingUp,
  Add,
  MoreVert,
  Notifications,
  CalendarToday,
  CheckCircle,
  Warning,
  Schedule,
  Grade,
  Analytics,
  Class,
  ArrowForward,
  Star,
  Update,
  Visibility,
  Edit,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardData {
  totalClasses: number;
  totalStudents: number;
  totalAssignments: number;
  pendingGrades: number;
  recentClasses: Array<{
    _id: string;
    name: string;
    code: string;
    studentsCount: number;
    assignmentsCount: number;
    pendingSubmissions: number;
    lastActivity: string;
    color: string;
  }>;
  pendingSubmissions: Array<{
    _id: string;
    studentName: string;
    assignmentTitle: string;
    submittedAt: string;
    className: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  recentActivity: Array<{
    type: 'submission' | 'student_joined' | 'assignment_created';
    message: string;
    timestamp: string;
    className?: string;
  }>;
  weeklyStats: {
    submissions: number;
    newStudents: number;
    assignmentsCreated: number;
    averageGrade: number;
  };
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Mock data
  const mockDashboardData: DashboardData = {
    totalClasses: 3,
    totalStudents: 85,
    totalAssignments: 26,
    pendingGrades: 12,
    recentClasses: [
      {
        _id: '1',
        name: 'Java Programming 101',
        code: 'JAVA101',
        studentsCount: 28,
        assignmentsCount: 8,
        pendingSubmissions: 5,
        lastActivity: '2025-07-29T10:30:00Z',
        color: '#1976d2',
      },
      {
        _id: '2',
        name: 'Advanced Java Development',
        code: 'JAVA201',
        studentsCount: 22,
        assignmentsCount: 6,
        pendingSubmissions: 3,
        lastActivity: '2025-07-29T08:15:00Z',
        color: '#9c27b0',
      },
      {
        _id: '3',
        name: 'Software Engineering Principles',
        code: 'SE301',
        studentsCount: 35,
        assignmentsCount: 12,
        pendingSubmissions: 4,
        lastActivity: '2025-07-28T16:45:00Z',
        color: '#4caf50',
      },
    ],
    pendingSubmissions: [
      {
        _id: '1',
        studentName: 'Alice Johnson',
        assignmentTitle: 'Object-Oriented Programming Basics',
        submittedAt: '2025-07-29T09:30:00Z',
        className: 'Java Programming 101',
        priority: 'high',
      },
      {
        _id: '2',
        studentName: 'Bob Smith',
        assignmentTitle: 'Data Structures Implementation',
        submittedAt: '2025-07-29T07:15:00Z',
        className: 'Advanced Java Development',
        priority: 'medium',
      },
      {
        _id: '3',
        studentName: 'Carol Davis',
        assignmentTitle: 'Unit Testing Assignment',
        submittedAt: '2025-07-28T14:20:00Z',
        className: 'Software Engineering Principles',
        priority: 'low',
      },
    ],
    recentActivity: [
      {
        type: 'submission',
        message: 'New submission from Alice Johnson for "OOP Basics"',
        timestamp: '2025-07-29T10:30:00Z',
        className: 'Java Programming 101',
      },
      {
        type: 'student_joined',
        message: 'David Wilson joined your class',
        timestamp: '2025-07-29T09:15:00Z',
        className: 'Advanced Java Development',
      },
      {
        type: 'assignment_created',
        message: 'Created new assignment "Exception Handling"',
        timestamp: '2025-07-28T16:45:00Z',
        className: 'Java Programming 101',
      },
    ],
    weeklyStats: {
      submissions: 45,
      newStudents: 7,
      assignmentsCreated: 4,
      averageGrade: 87.5,
    },
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, []);

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission': return <Assignment sx={{ color: '#1976d2' }} />;
      case 'student_joined': return <People sx={{ color: '#4caf50' }} />;
      case 'assignment_created': return <Add sx={{ color: '#9c27b0' }} />;
      default: return <Update />;
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, classId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedClass(classId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedClass(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.1)', opacity: 0.7 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            <School sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Loading your dashboard...
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Getting everything ready for you
          </Typography>
        </Box>
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
              {getGreeting()}, {user?.name?.split(' ')[0]}! 👨‍🏫
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Here's what's happening in your classes today
            </Typography>
          </Box>
        </Stack>

        {/* Quick Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/create-assignment"
            sx={{ borderRadius: 3 }}
          >
            Create Assignment
          </Button>
          <Button
            variant="outlined"
            startIcon={<Class />}
            component={Link}
            to="/classes"
            sx={{ borderRadius: 3 }}
          >
            Manage Classes
          </Button>
          <Button
            variant="outlined"
            startIcon={<Grade />}
            component={Link}
            to="/grading"
            sx={{ borderRadius: 3 }}
          >
            Grade Submissions
          </Button>
        </Stack>
      </Box>

      {/* Pending Reviews Alert */}
      {dashboardData?.pendingGrades && dashboardData.pendingGrades > 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button size="small" component={Link} to="/grading">
              Review Now
            </Button>
          }
        >
          <AlertTitle>Pending Reviews</AlertTitle>
          You have {dashboardData.pendingGrades} submissions waiting for your review.
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
                    {dashboardData?.totalClasses || 0}
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
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {dashboardData?.totalStudents || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Students
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
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {dashboardData?.totalAssignments || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Assignments Created
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
                  <Grade />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {dashboardData?.pendingGrades || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Pending Reviews
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* My Classes */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    🏫 My Classes
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Overview of your active classes
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/classes"
                  sx={{ borderRadius: 3 }}
                >
                  View All
                </Button>
              </Stack>

              {dashboardData?.recentClasses && dashboardData.recentClasses.length > 0 ? (
                <Stack spacing={2}>
                  {dashboardData.recentClasses.map((classItem, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: classItem.color,
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${classItem.color}30`,
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: classItem.color,
                            width: 48,
                            height: 48,
                            fontSize: '1.2rem',
                            fontWeight: 600,
                          }}
                        >
                          {classItem.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {classItem.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                {classItem.code} • {classItem.studentsCount} students
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Chip
                                  label={`${classItem.assignmentsCount} assignments`}
                                  size="small"
                                  variant="outlined"
                                />
                                {classItem.pendingSubmissions > 0 && (
                                  <Chip
                                    label={`${classItem.pendingSubmissions} pending`}
                                    size="small"
                                    color="warning"
                                  />
                                )}
                              </Stack>
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="View class">
                                <IconButton
                                  component={Link}
                                  to={`/class/${classItem._id}`}
                                  sx={{ color: classItem.color }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="More options">
                                <IconButton
                                  onClick={(e) => handleMenuOpen(e, classItem._id)}
                                  sx={{ color: 'text.secondary' }}
                                >
                                  <MoreVert />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <School sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    No classes yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Create your first class to get started
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Submissions & Activity */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Pending Submissions */}
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    📝 Pending Reviews
                  </Typography>
                  <Badge badgeContent={dashboardData?.pendingSubmissions?.length || 0} color="error">
                    <Grade />
                  </Badge>
                </Stack>
                {dashboardData?.pendingSubmissions && dashboardData.pendingSubmissions.length > 0 ? (
                  <Stack spacing={2}>
                    {dashboardData.pendingSubmissions.slice(0, 3).map((submission, index) => (
                      <Box key={index}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {submission.studentName}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {submission.assignmentTitle}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              {submission.className}
                            </Typography>
                          </Box>
                          <Chip
                            label={submission.priority}
                            size="small"
                            color={getPriorityColor(submission.priority) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Stack>
                        {index < dashboardData.pendingSubmissions.length - 1 && <Divider />}
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      fullWidth
                      component={Link}
                      to="/grading"
                      sx={{ mt: 2, borderRadius: 2 }}
                    >
                      Review All Submissions
                    </Button>
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                    No submissions to review
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🔔 Recent Activity
                </Typography>
                {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
                  <Stack spacing={2}>
                    {dashboardData.recentActivity.slice(0, 4).map((activity, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'background.paper', border: '2px solid', borderColor: 'divider' }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {activity.message}
                          </Typography>
                          {activity.className && (
                            <Typography variant="caption" sx={{ color: 'primary.main', display: 'block' }}>
                              {activity.className}
                            </Typography>
                          )}
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                    No recent activity
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📊 This Week
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {dashboardData?.weeklyStats?.submissions || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Submissions
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {dashboardData?.weeklyStats?.newStudents || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        New Students
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {dashboardData?.weeklyStats?.assignmentsCreated || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Assignments
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                        {dashboardData?.weeklyStats?.averageGrade || 0}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Avg Grade
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Class Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          <ListItemText>View Class</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Edit Class</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Analytics />
          </ListItemIcon>
          <ListItemText>View Analytics</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TeacherDashboard;
