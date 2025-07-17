import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { Assignment, TrendingUp, School, Grade } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

interface DashboardData {
  classes: number;
  assignments: any[];
  submissions: any[];
  stats: {
    completedAssignments: number;
    averageGrade: number;
    streak: number;
  };
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
      <Box>
        <Typography variant="h4" gutterBottom>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hello, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back to SkillVerse. Ready to continue your learning journey?
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.stats.completedAssignments || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
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
                  <Grade />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.stats.averageGrade.toFixed(1) || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Grade
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
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {dashboardData?.stats.streak || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Day Streak
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
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <School />
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
      </Grid>

      <Grid container spacing={3}>
        {/* Due This Week */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Due This Week
              </Typography>
              {dashboardData?.assignments && dashboardData.assignments.length > 0 ? (
                <List>
                  {dashboardData.assignments.map((assignment, index) => (
                    <ListItem key={index} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                      />
                      <Chip
                        label={assignment.difficulty}
                        color={
                          assignment.difficulty === 'beginner' ? 'success' :
                          assignment.difficulty === 'intermediate' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No assignments due this week.
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
              {dashboardData?.submissions && dashboardData.submissions.length > 0 ? (
                <List>
                  {dashboardData.submissions.map((submission, index) => (
                    <ListItem key={index} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <Grade />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={submission.assignmentId?.title || 'Assignment'}
                        secondary={`Submitted: ${new Date(submission.submittedAt).toLocaleDateString()}`}
                      />
                      {submission.grade && (
                        <Chip
                          label={`${submission.grade}%`}
                          color={submission.grade >= 90 ? 'success' : submission.grade >= 70 ? 'warning' : 'error'}
                          size="small"
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent grades available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Skill Progress */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Progress
              </Typography>
              <Grid container spacing={3}>
                {['JavaScript', 'Python', 'Data Structures', 'Algorithms'].map((skill, index) => (
                  <Grid item xs={12} md={6} key={skill}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{skill}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Math.floor(Math.random() * 40) + 60}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.floor(Math.random() * 40) + 60}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;