import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import { TrendingUp, CheckCircle, Schedule } from '@mui/icons-material';

const Progress: React.FC = () => {
  const progressData = [
    { skill: 'JavaScript', progress: 75, level: 'Intermediate' },
    { skill: 'Python', progress: 60, level: 'Beginner' },
    { skill: 'Data Structures', progress: 45, level: 'Beginner' },
    { skill: 'Algorithms', progress: 30, level: 'Beginner' },
    { skill: 'React', progress: 80, level: 'Intermediate' },
    { skill: 'Node.js', progress: 55, level: 'Beginner' },
  ];

  const recentActivity = [
    { type: 'completed', title: 'Array Manipulation', date: '2 hours ago', points: 85 },
    { type: 'submitted', title: 'Binary Search Implementation', date: '1 day ago', points: null },
    { type: 'completed', title: 'React Component Design', date: '3 days ago', points: 92 },
    { type: 'completed', title: 'Sorting Algorithms', date: '1 week ago', points: 78 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Progress
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Track your learning progress and skill development
      </Typography>

      <Grid container spacing={3}>
        {/* Overall Progress */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Progress
              </Typography>
              {progressData.map((item, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">{item.skill}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={item.level}
                        size="small"
                        color={item.level === 'Beginner' ? 'default' : 'primary'}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {item.progress}%
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress Summary
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">Level 3</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intermediate Developer
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={65}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                65% to Level 4
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                This Week
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Assignments Completed</Typography>
                <Typography variant="body2" color="primary">3</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Time Spent</Typography>
                <Typography variant="body2" color="primary">12h 30m</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Points Earned</Typography>
                <Typography variant="body2" color="primary">255</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Streak</Typography>
                <Typography variant="body2" color="primary">7 days</Typography>
              </Box>
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
                {recentActivity.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivity.length - 1}>
                    <ListItemIcon>
                      {activity.type === 'completed' ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Schedule color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.date}
                    />
                    {activity.points && (
                      <Chip
                        label={`${activity.points} pts`}
                        color={activity.points >= 90 ? 'success' : activity.points >= 70 ? 'warning' : 'error'}
                        size="small"
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Progress;