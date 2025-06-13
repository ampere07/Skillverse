import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Assignment,
  Grade,
  TrendingUp,
  Star,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    upcomingAssignments: [],
    recentGrades: [],
    stats: {
      totalAssignments: 0,
      completedAssignments: 0,
      averageGrade: 0,
      streak: 0,
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/student/dashboard', {
        withCredentials: true
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 1) return `Due in ${diffDays} days`;
    return 'Overdue';
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'info';
    if (grade >= 70) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Dashboard" />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`Hello, ${user?.name}!`}
        subtitle="Welcome back to SkillVerse. Here's what's happening with your studies."
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.stats.totalAssignments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Assignments
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Grade sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.stats.completedAssignments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.stats.averageGrade}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Grade
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.stats.streak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Day Streak
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Due This Week */}
        <Grid item xs={12} md={6}>
          <Card
            title="Due This Week"
            subtitle="Assignments you need to complete soon"
            actions={
              <Button
                endIcon={<ArrowForward />}
                onClick={() => navigate('/assignments')}
              >
                View All
              </Button>
            }
          >
            {dashboardData.upcomingAssignments.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No assignments due this week. Great job staying on top of your work!
              </Typography>
            ) : (
              <Box>
                {dashboardData.upcomingAssignments.slice(0, 4).map((assignment) => (
                  <Paper
                    key={assignment._id}
                    sx={{
                      p: 2,
                      mb: 1,
                      '&:hover': { backgroundColor: 'action.hover' },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/assignments/${assignment._id}/code`)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" fontWeight="500">
                          {assignment.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignment.classId?.name}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          label={getDaysUntilDue(assignment.dueDate)}
                          size="small"
                          color={new Date(assignment.dueDate) < new Date() ? 'error' : 'primary'}
                          sx={{ mb: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary" display="block">
                          {assignment.totalPoints} points
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Recent Grades */}
        <Grid item xs={12} md={6}>
          <Card
            title="Recent Grades"
            subtitle="Your latest assignment results"
            actions={
              <Button
                endIcon={<ArrowForward />}
                onClick={() => navigate('/progress')}
              >
                View All
              </Button>
            }
          >
            {dashboardData.recentGrades.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No grades yet. Complete some assignments to see your progress!
              </Typography>
            ) : (
              <Box>
                {dashboardData.recentGrades.slice(0, 4).map((submission) => (
                  <Paper
                    key={submission._id}
                    sx={{ p: 2, mb: 1 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="500">
                          {submission.assignmentId?.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Graded {formatDate(submission.gradedAt)}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${submission.grade}%`}
                        color={getGradeColor(submission.grade)}
                        size="small"
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Recommended for You */}
        <Grid item xs={12}>
          <Card
            title="Recommended for You"
            subtitle="AI-suggested assignments based on your skill level"
          >
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              AI recommendations coming soon! Complete more assignments to get personalized suggestions.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;