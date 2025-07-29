import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  Divider,
  Alert,
  Fab,
} from '@mui/material';
import {
  School,
  Person,
  Assignment,
  TrendingUp,
  Add,
  MoreVert,
  Code,
  CalendarToday,
  Notifications,
  NotificationsOff,
  ExitToApp,
  Star,
  StarBorder,
  Group,
  BookOpen,
  CheckCircle,
  AccessTime,
  Visibility,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface ClassData {
  _id: string;
  name: string;
  code: string;
  description: string;
  teacherName: string;
  teacherAvatar?: string;
  studentsCount: number;
  assignmentsCount: number;
  completedAssignments: number;
  averageGrade: number;
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
  recentActivity: Array<{
    type: 'assignment' | 'grade' | 'announcement';
    message: string;
    date: string;
  }>;
  color: string;
  isStarred: boolean;
  notificationsEnabled: boolean;
}

const MyClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joiningClass, setJoiningClass] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Mock data
  const mockClasses: ClassData[] = [
    {
      _id: '1',
      name: 'Java Programming 101',
      code: 'JAVA101',
      description: 'Introduction to Java programming concepts, syntax, and object-oriented programming principles.',
      teacherName: 'Dr. Sarah Johnson',
      studentsCount: 28,
      assignmentsCount: 12,
      completedAssignments: 8,
      averageGrade: 87,
      nextAssignment: {
        title: 'Object-Oriented Programming Basics',
        dueDate: '2025-08-05T23:59:00Z',
      },
      recentActivity: [
        { type: 'assignment', message: 'New assignment posted: Variables and Data Types', date: '2025-07-28' },
        { type: 'grade', message: 'Grade received for Hello World Program: 95/100', date: '2025-07-27' },
      ],
      color: '#1976d2',
      isStarred: true,
      notificationsEnabled: true,
    },
    {
      _id: '2',
      name: 'Advanced Java Development',
      code: 'JAVA201',
      description: 'Advanced Java concepts including data structures, algorithms, and design patterns.',
      teacherName: 'Prof. Michael Chen',
      studentsCount: 22,
      assignmentsCount: 8,
      completedAssignments: 5,
      averageGrade: 92,
      nextAssignment: {
        title: 'Implement Binary Search Tree',
        dueDate: '2025-08-08T23:59:00Z',
      },
      recentActivity: [
        { type: 'assignment', message: 'New assignment posted: Data Structures Implementation', date: '2025-07-29' },
        { type: 'announcement', message: 'Class moved to virtual format for next week', date: '2025-07-26' },
      ],
      color: '#9c27b0',
      isStarred: false,
      notificationsEnabled: true,
    },
    {
      _id: '3',
      name: 'Software Engineering Principles',
      code: 'SE301',
      description: 'Learn software development methodologies, testing, and project management principles.',
      teacherName: 'Dr. Emily Rodriguez',
      studentsCount: 35,
      assignmentsCount: 6,
      completedAssignments: 4,
      averageGrade: 89,
      recentActivity: [
        { type: 'grade', message: 'Grade received for Unit Testing Assignment: 88/100', date: '2025-07-25' },
      ],
      color: '#4caf50',
      isStarred: false,
      notificationsEnabled: false,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClasses(mockClasses);
      setLoading(false);
    }, 1000);
  }, []);

  const handleJoinClass = async () => {
    if (!classCode.trim()) return;
    
    setJoiningClass(true);
    // Simulate API call
    setTimeout(() => {
      setJoiningClass(false);
      setJoinDialogOpen(false);
      setClassCode('');
      // Show success message or add class to list
    }, 2000);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, classId: string) => {
    event.preventDefault();
    setMenuAnchorEl(event.currentTarget);
    setSelectedClass(classId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedClass(null);
  };

  const toggleStar = (classId: string) => {
    setClasses(classes.map(cls => 
      cls._id === classId ? { ...cls, isStarred: !cls.isStarred } : cls
    ));
    handleMenuClose();
  };

  const toggleNotifications = (classId: string) => {
    setClasses(classes.map(cls => 
      cls._id === classId ? { ...cls, notificationsEnabled: !cls.notificationsEnabled } : cls
    ));
    handleMenuClose();
  };

  const ClassCard: React.FC<{ classData: ClassData }> = ({ classData }) => {
    const completionRate = (classData.completedAssignments / classData.assignmentsCount) * 100;
    const daysUntilNext = classData.nextAssignment 
      ? Math.ceil((new Date(classData.nextAssignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
          border: `2px solid transparent`,
          '&:hover': {
            borderColor: classData.color,
          },
        }}
      >
        {/* Class Header with Color Bar */}
        <Box
          sx={{
            height: 6,
            background: `linear-gradient(135deg, ${classData.color} 0%, ${classData.color}CC 100%)`,
          }}
        />

        <CardContent sx={{ flex: 1, p: 3 }}>
          {/* Header with Menu */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: classData.color,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  {classData.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {classData.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {classData.code} • {classData.teacherName}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            
            <Stack direction="row" spacing={0.5}>
              {classData.isStarred && (
                <Star sx={{ color: '#ffc107', fontSize: 20 }} />
              )}
              {classData.notificationsEnabled && (
                <Badge color="error" variant="dot">
                  <Notifications sx={{ color: 'text.secondary', fontSize: 20 }} />
                </Badge>
              )}
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, classData._id)}
              >
                <MoreVert />
              </IconButton>
            </Stack>
          </Stack>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {classData.description}
          </Typography>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: classData.color }}>
                  {classData.studentsCount}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Students
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: classData.color }}>
                  {classData.averageGrade}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Avg Grade
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Progress */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Assignment Progress
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {classData.completedAssignments}/{classData.assignmentsCount}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${classData.color} 0%, ${classData.color}CC 100%)`,
                },
              }}
            />
          </Box>

          {/* Next Assignment */}
          {classData.nextAssignment && (
            <Paper
              sx={{
                p: 2,
                bgcolor: `${classData.color}08`,
                border: `1px solid ${classData.color}30`,
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <AccessTime sx={{ fontSize: 16, color: classData.color }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: classData.color }}>
                  Next Assignment
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {classData.nextAssignment.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {daysUntilNext === 0 ? 'Due today' : 
                 daysUntilNext === 1 ? 'Due tomorrow' :
                 daysUntilNext && daysUntilNext > 0 ? `Due in ${daysUntilNext} days` : 'Overdue'}
              </Typography>
            </Paper>
          )}

          {/* Recent Activity */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Recent Activity
            </Typography>
            <Stack spacing={1}>
              {classData.recentActivity.slice(0, 2).map((activity, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: classData.color,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.primary',
                        lineHeight: 1.4,
                        display: 'block',
                      }}
                    >
                      {activity.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                      }}
                    >
                      {new Date(activity.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            component={Link}
            to={`/class/${classData._id}`}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${classData.color} 0%, ${classData.color}CC 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${classData.color}DD 0%, ${classData.color}AA 100%)`,
              },
            }}
          >
            Enter Class
          </Button>
        </CardActions>
      </Card>
    );
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
            Loading your classes...
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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          🏫 My Classes
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Manage your enrolled classes and track your progress
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Total Classes', value: classes.length, color: 'primary.main', icon: <School /> },
          { label: 'Active Assignments', value: classes.reduce((sum, cls) => sum + (cls.assignmentsCount - cls.completedAssignments), 0), color: 'warning.main', icon: <Assignment /> },
          { label: 'Average Grade', value: `${Math.round(classes.reduce((sum, cls) => sum + cls.averageGrade, 0) / classes.length)}%`, color: 'success.main', icon: <TrendingUp /> },
          { label: 'Starred Classes', value: classes.filter(cls => cls.isStarred).length, color: 'info.main', icon: <Star /> },
        ].map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No classes enrolled yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Join your first class to get started with your learning journey
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => setJoinDialogOpen(true)}
            sx={{ borderRadius: 3 }}
          >
            Join a Class
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {classes
              .sort((a, b) => (b.isStarred ? 1 : 0) - (a.isStarred ? 1 : 0))
              .map((classData) => (
                <Grid item xs={12} md={6} lg={4} key={classData._id}>
                  <ClassCard classData={classData} />
                </Grid>
              ))}
          </Grid>

          {/* Join Class FAB */}
          <Tooltip title="Join a new class">
            <Fab
              color="primary"
              onClick={() => setJoinDialogOpen(true)}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Add />
            </Fab>
          </Tooltip>
        </>
      )}

      {/* Class Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedClass && toggleStar(selectedClass)}>
          <ListItemIcon>
            {selectedClass && classes.find(c => c._id === selectedClass)?.isStarred ? <Star /> : <StarBorder />}
          </ListItemIcon>
          <ListItemText>
            {selectedClass && classes.find(c => c._id === selectedClass)?.isStarred ? 'Remove Star' : 'Add Star'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedClass && toggleNotifications(selectedClass)}>
          <ListItemIcon>
            {selectedClass && classes.find(c => c._id === selectedClass)?.notificationsEnabled ? <NotificationsOff /> : <Notifications />}
          </ListItemIcon>
          <ListItemText>
            {selectedClass && classes.find(c => c._id === selectedClass)?.notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <ExitToApp sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Leave Class</ListItemText>
        </MenuItem>
      </Menu>

      {/* Join Class Dialog */}
      <Dialog
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Add />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Join a Class
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter the class code provided by your teacher
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Class Code"
            fullWidth
            variant="outlined"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            placeholder="e.g., ABC123"
            helperText="Class codes are typically 6 characters long"
            disabled={joiningClass}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setJoinDialogOpen(false)}
            disabled={joiningClass}
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoinClass}
            variant="contained"
            disabled={!classCode.trim() || joiningClass}
            sx={{ borderRadius: 2 }}
          >
            {joiningClass ? 'Joining...' : 'Join Class'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyClasses;
