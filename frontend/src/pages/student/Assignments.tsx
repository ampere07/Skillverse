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
  LinearProgress,
  Stack,
  Paper,
  Divider,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
  Badge,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  AccessTime,
  CalendarToday,
  Code,
  CheckCircle,
  Schedule,
  Warning,
  FilterList,
  Search,
  Sort,
  ViewList,
  ViewModule,
  ArrowForward,
  Star,
  StarBorder,
  BookmarkBorder,
  Bookmark,
  PlayArrow,
  Done,
  Update,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  classId: {
    _id: string;
    name: string;
    code: string;
  };
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  submission?: {
    _id: string;
    submittedAt: string;
    grade: number | null;
    status: 'pending' | 'graded';
  };
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // in minutes
}

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [bookmarkedAssignments, setBookmarkedAssignments] = useState<Set<string>>(new Set());

  const mockAssignments: Assignment[] = [
    {
      _id: '1',
      title: 'Basic Java Syntax and Variables',
      description: 'Learn the fundamentals of Java programming including variables, data types, and basic syntax.',
      dueDate: '2025-08-05T23:59:00Z',
      points: 100,
      classId: { _id: '1', name: 'Java Programming 101', code: 'JAVA101' },
      status: 'not_started',
      priority: 'high',
      estimatedTime: 90,
    },
    {
      _id: '2',
      title: 'Object-Oriented Programming Concepts',
      description: 'Implement classes, objects, inheritance, and polymorphism in Java.',
      dueDate: '2025-08-08T23:59:00Z',
      points: 150,
      classId: { _id: '1', name: 'Java Programming 101', code: 'JAVA101' },
      status: 'in_progress',
      submission: { _id: '1', submittedAt: '2025-07-25T10:30:00Z', grade: null, status: 'pending' },
      priority: 'medium',
      estimatedTime: 120,
    },
    {
      _id: '3',
      title: 'Data Structures Implementation',
      description: 'Create and manipulate arrays, lists, stacks, and queues in Java.',
      dueDate: '2025-08-12T23:59:00Z',
      points: 200,
      classId: { _id: '2', name: 'Advanced Java', code: 'JAVA201' },
      status: 'completed',
      submission: { _id: '2', submittedAt: '2025-07-20T14:15:00Z', grade: 185, status: 'graded' },
      priority: 'low',
      estimatedTime: 180,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in_progress': return <Update />;
      case 'overdue': return <Warning />;
      default: return <PlayArrow />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleBookmark = (assignmentId: string) => {
    const newBookmarks = new Set(bookmarkedAssignments);
    if (newBookmarks.has(assignmentId)) {
      newBookmarks.delete(assignmentId);
    } else {
      newBookmarks.add(assignmentId);
    }
    setBookmarkedAssignments(newBookmarks);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.classId.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || assignment.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'points':
        return b.points - a.points;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const AssignmentCard: React.FC<{ assignment: Assignment; compact?: boolean }> = ({ 
    assignment, 
    compact = false 
  }) => {
    const daysUntilDue = getDaysUntilDue(assignment.dueDate);
    const isBookmarked = bookmarkedAssignments.has(assignment._id);

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
          border: `2px solid transparent`,
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        <CardContent sx={{ flex: 1, p: 3 }}>
          {/* Header */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: getPriorityColor(assignment.priority),
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {assignment.title}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {assignment.classId.name}
              </Typography>
            </Box>
            <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Bookmark assignment'}>
              <IconButton
                size="small"
                onClick={() => toggleBookmark(assignment._id)}
                sx={{ ml: 1 }}
              >
                {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 3,
              display: '-webkit-box',
              WebkitLineClamp: compact ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {assignment.description}
          </Typography>

          {/* Status and Priority */}
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip
              icon={getStatusIcon(assignment.status)}
              label={assignment.status.replace('_', ' ').toUpperCase()}
              color={getStatusColor(assignment.status) as any}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`${assignment.priority} priority`}
              size="small"
              sx={{
                bgcolor: `${getPriorityColor(assignment.priority)}15`,
                color: getPriorityColor(assignment.priority),
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
          </Stack>

          {/* Assignment Info */}
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Due {new Date(assignment.dueDate).toLocaleDateString()}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: daysUntilDue <= 1 ? 'error.main' : daysUntilDue <= 3 ? 'warning.main' : 'text.secondary',
                  fontWeight: 600,
                }}
              >
                {daysUntilDue === 0 ? 'Due today' : 
                 daysUntilDue === 1 ? 'Due tomorrow' :
                 daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                 `${daysUntilDue} days left`}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ~{assignment.estimatedTime} min
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {assignment.points} points
              </Typography>
            </Box>

            {/* Grade display if submitted */}
            {assignment.submission && (
              <Box>
                <Divider sx={{ mb: 2 }} />
                {assignment.submission.status === 'graded' ? (
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Your Grade:
                    </Typography>
                    <Chip
                      label={`${assignment.submission.grade}/${assignment.points}`}
                      color={
                        assignment.submission.grade! >= assignment.points * 0.9 ? 'success' :
                        assignment.submission.grade! >= assignment.points * 0.8 ? 'warning' : 'error'
                      }
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>
                ) : (
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Status:
                    </Typography>
                    <Chip
                      label="Pending Review"
                      color="warning"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>
                )}
              </Box>
            )}
          </Stack>
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            endIcon={<ArrowForward />}
            component={Link}
            to={`/assignment/${assignment._id}`}
            disabled={assignment.status === 'completed'}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              background: assignment.status === 'completed' 
                ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            }}
          >
            {assignment.status === 'completed' ? 'View Submission' :
             assignment.status === 'in_progress' ? 'Continue Working' : 'Start Assignment'}
          </Button>
        </CardActions>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
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
              <AssignmentIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Loading your assignments...
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
          📚 Your Assignments
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Track your progress and stay on top of your coursework
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Total', count: assignments.length, color: 'primary.main' },
          { label: 'Completed', count: assignments.filter(a => a.status === 'completed').length, color: 'success.main' },
          { label: 'In Progress', count: assignments.filter(a => a.status === 'in_progress').length, color: 'warning.main' },
          { label: 'Due Soon', count: assignments.filter(a => getDaysUntilDue(a.dueDate) <= 3 && a.status !== 'completed').length, color: 'error.main' },
        ].map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                {stat.count}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <Stack direction="row" spacing={1}>
            <Button
              variant={selectedFilter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setSelectedFilter('all')}
              size="small"
            >
              All
            </Button>
            <Button
              variant={selectedFilter === 'not_started' ? 'contained' : 'outlined'}
              onClick={() => setSelectedFilter('not_started')}
              size="small"
            >
              To Do
            </Button>
            <Button
              variant={selectedFilter === 'in_progress' ? 'contained' : 'outlined'}
              onClick={() => setSelectedFilter('in_progress')}
              size="small"
            >
              In Progress
            </Button>
            <Button
              variant={selectedFilter === 'completed' ? 'contained' : 'outlined'}
              onClick={() => setSelectedFilter('completed')}
              size="small"
            >
              Completed
            </Button>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Sort">
              <IconButton onClick={(e) => setSortAnchorEl(e.currentTarget)}>
                <Sort />
              </IconButton>
            </Tooltip>
            <Tooltip title="View mode">
              <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
      >
        {[
          { value: 'dueDate', label: 'Due Date', icon: <CalendarToday /> },
          { value: 'priority', label: 'Priority', icon: <Warning /> },
          { value: 'points', label: 'Points', icon: <Star /> },
          { value: 'title', label: 'Title', icon: <Sort /> },
        ].map((option) => (
          <MenuItem
            key={option.value}
            selected={sortBy === option.value}
            onClick={() => {
              setSortBy(option.value);
              setSortAnchorEl(null);
            }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* Assignments Grid/List */}
      {sortedAssignments.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No assignments found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new assignments'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sortedAssignments.map((assignment) => (
            <Grid item xs={12} sm={6} lg={4} key={assignment._id}>
              <AssignmentCard assignment={assignment} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Assignments;
