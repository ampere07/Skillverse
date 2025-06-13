import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Class,
  People,
  Assignment,
  Pending,
  Add,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    classes: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingSubmissions: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/teacher/dashboard', {
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
        subtitle="Welcome to your teaching dashboard. Here's an overview of your classes and student activity."
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Class sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.classes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Classes
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <People sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.totalStudents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Students
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.totalAssignments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assignments Created
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Pending sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.pendingSubmissions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Grades
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card title="Quick Actions" subtitle="Common tasks to get you started">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/classes')}
                fullWidth
              >
                Create New Class
              </Button>
              <Button
                variant="outlined"
                startIcon={<Assignment />}
                onClick={() => navigate('/assignments/create')}
                fullWidth
              >
                Create Assignment
              </Button>
              <Button
                variant="outlined"
                startIcon={<Pending />}
                onClick={() => navigate('/grading')}
                fullWidth
              >
                Grade Submissions
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            title="Pending Submissions"
            subtitle="Assignments waiting for your review"
            actions={
              <Button
                endIcon={<ArrowForward />}
                onClick={() => navigate('/grading')}
              >
                View All
              </Button>
            }
          >
            {dashboardData.pendingSubmissions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No pending submissions. All caught up!
              </Typography>
            ) : (
              <Box>
                {dashboardData.pendingSubmissions.slice(0, 4).map((submission) => (
                  <Paper
                    key={submission._id}
                    sx={{
                      p: 2,
                      mb: 1,
                      '&:hover': { backgroundColor: 'action.hover' },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/grading/${submission.assignmentId._id}`)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" fontWeight="500">
                          {submission.assignmentId?.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {submission.studentId?.name}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          label="Pending"
                          size="small"
                          color="warning"
                          sx={{ mb: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatDate(submission.submittedAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card
        title="Recent Activity"
        subtitle="Latest submissions and student activity"
        actions={
          <Button
            endIcon={<ArrowForward />}
            onClick={() => navigate('/analytics')}
          >
            View Analytics
          </Button>
        }
      >
        {dashboardData.recentActivity.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No recent activity. Students will appear here once they start submitting assignments.
          </Typography>
        ) : (
          <Box>
            {dashboardData.recentActivity.slice(0, 6).map((activity) => (
              <Paper
                key={activity._id}
                sx={{ p: 2, mb: 1 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="500">
                      {activity.studentId?.name} submitted {activity.assignmentId?.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(activity.submittedAt)}
                    </Typography>
                  </Box>
                  <Chip
                    label={activity.status}
                    size="small"
                    color={activity.status === 'graded' ? 'success' : 'warning'}
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default TeacherDashboard;