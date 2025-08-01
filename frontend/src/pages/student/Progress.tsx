import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Paper,
  Chip,
  Avatar,
  Button,
  Tab,
  Tabs,
  Divider,
  Badge,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule,
  Star,
  Code,
  Speed,
  EmojiEvents,
  Timeline,
  Assessment,
  School,
  CalendarToday,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface ProgressData {
  overallProgress: {
    completedAssignments: number;
    totalAssignments: number;
    averageGrade: number;
    currentStreak: number;
  };
  weeklyProgress: Array<{
    week: string;
    completed: number;
    totalTime: number;
    averageGrade: number;
  }>;
  subjectProgress: Array<{
    subject: string;
    completed: number;
    total: number;
    averageGrade: number;
    color: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  recentGrades: Array<{
    assignmentTitle: string;
    grade: number;
    maxGrade: number;
    submittedAt: string;
    className: string;
    improvement: number;
  }>;
  timeSpent: {
    thisWeek: number;
    lastWeek: number;
    average: number;
  };
  strengths: string[];
  areasForImprovement: string[];
}

const Progress: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Mock data
  const mockProgressData: ProgressData = {
    overallProgress: {
      completedAssignments: 24,
      totalAssignments: 30,
      averageGrade: 87.5,
      currentStreak: 12,
    },
    weeklyProgress: [
      { week: 'Week 1', completed: 4, totalTime: 120, averageGrade: 85 },
      { week: 'Week 2', completed: 5, totalTime: 150, averageGrade: 88 },
      { week: 'Week 3', completed: 6, totalTime: 180, averageGrade: 90 },
      { week: 'Week 4', completed: 5, totalTime: 135, averageGrade: 86 },
      { week: 'Week 5', completed: 4, totalTime: 110, averageGrade: 89 },
    ],
    subjectProgress: [
      { subject: 'Java Basics', completed: 8, total: 10, averageGrade: 92, color: '#1976d2' },
      { subject: 'OOP Concepts', completed: 6, total: 8, averageGrade: 85, color: '#9c27b0' },
      { subject: 'Data Structures', completed: 5, total: 7, averageGrade: 88, color: '#4caf50' },
      { subject: 'Algorithms', completed: 3, total: 5, averageGrade: 82, color: '#ff9800' },
      { subject: 'Testing', completed: 2, total: 3, averageGrade: 90, color: '#f44336' },
    ],
    achievements: [
      {
        id: '1',
        title: 'First Steps',
        description: 'Completed your first assignment',
        icon: '🎯',
        unlockedAt: '2025-07-15T10:00:00Z',
        rarity: 'common',
      },
      {
        id: '2',
        title: 'Code Warrior',
        description: 'Completed 10 assignments',
        icon: '⚔️',
        unlockedAt: '2025-07-25T14:30:00Z',
        rarity: 'rare',
      },
      {
        id: '3',
        title: 'Perfect Score',
        description: 'Got 100% on an assignment',
        icon: '🌟',
        unlockedAt: '2025-07-20T09:15:00Z',
        rarity: 'epic',
      },
    ],
    recentGrades: [
      {
        assignmentTitle: 'Exception Handling',
        grade: 95,
        maxGrade: 100,
        submittedAt: '2025-07-29T10:30:00Z',
        className: 'Java Programming 101',
        improvement: 8,
      },
      {
        assignmentTitle: 'Binary Search Tree',
        grade: 88,
        maxGrade: 100,
        submittedAt: '2025-07-28T15:45:00Z',
        className: 'Data Structures',
        improvement: -2,
      },
      {
        assignmentTitle: 'Unit Testing',
        grade: 92,
        maxGrade: 100,
        submittedAt: '2025-07-27T11:20:00Z',
        className: 'Software Engineering',
        improvement: 5,
      },
    ],
    timeSpent: {
      thisWeek: 145,
      lastWeek: 128,
      average: 135,
    },
    strengths: ['Object-Oriented Programming', 'Problem Solving', 'Code Structure'],
    areasForImprovement: ['Algorithm Optimization', 'Exception Handling', 'Testing Practices'],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProgressData(mockProgressData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#757575';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#757575';
    }
  };

  const progressChartData = {
    labels: progressData?.weeklyProgress.map(week => week.week) || [],
    datasets: [
      {
        label: 'Assignments Completed',
        data: progressData?.weeklyProgress.map(week => week.completed) || [],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Average Grade',
        data: progressData?.weeklyProgress.map(week => week.averageGrade) || [],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const subjectChartData = {
    labels: progressData?.subjectProgress.map(subject => subject.subject) || [],
    datasets: [
      {
        data: progressData?.subjectProgress.map(subject => 
          (subject.completed / subject.total) * 100
        ) || [],
        backgroundColor: progressData?.subjectProgress.map(subject => subject.color) || [],
        borderWidth: 0,
      },
    ],
  };

  const timeSpentData = {
    labels: ['This Week', 'Last Week', 'Average'],
    datasets: [
      {
        label: 'Minutes',
        data: progressData ? [
          progressData.timeSpent.thisWeek,
          progressData.timeSpent.lastWeek,
          progressData.timeSpent.average,
        ] : [],
        backgroundColor: ['#1976d2', '#9c27b0', '#4caf50'],
        borderRadius: 8,
      },
    ],
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
            <TrendingUp sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Loading your progress...
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Analyzing your learning journey
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
          📈 Your Progress
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Track your learning journey and celebrate your achievements
        </Typography>
      </Box>

      {/* Progress Highlights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {progressData?.overallProgress.completedAssignments}/{progressData?.overallProgress.totalAssignments}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Assignments Done
                  </Typography>
                </Box>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progressData ? (progressData.overallProgress.completedAssignments / progressData.overallProgress.totalAssignments) * 100 : 0}
                sx={{
                  mt: 2,
                  height: 6,
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {progressData?.overallProgress.averageGrade}%
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
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                  <Speed />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {progressData?.timeSpent.thisWeek}m
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    This Week
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                {progressData && progressData.timeSpent.thisWeek > progressData.timeSpent.lastWeek ? (
                  <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  vs last week
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                  <EmojiEvents />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {progressData?.overallProgress.currentStreak}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Day Streak
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
            },
          }}
        >
          <Tab icon={<Timeline />} label="Progress Chart" />
          <Tab icon={<Assessment />} label="Subject Analysis" />
          <Tab icon={<EmojiEvents />} label="Achievements" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Progress Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  📊 Weekly Progress
                </Typography>
                <Box sx={{ height: 400 }}>
                  <Line
                    data={progressChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                      scales: {
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                          title: {
                            display: true,
                            text: 'Assignments Completed',
                          },
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          title: {
                            display: true,
                            text: 'Average Grade (%)',
                          },
                          grid: {
                            drawOnChartArea: false,
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Grades */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🎯 Recent Grades
                </Typography>
                <Stack spacing={2}>
                  {progressData?.recentGrades.map((grade, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {grade.assignmentTitle}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {grade.improvement > 0 ? (
                            <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
                          ) : grade.improvement < 0 ? (
                            <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
                          ) : null}
                          <Chip
                            label={`${grade.grade}/${grade.maxGrade}`}
                            color={
                              grade.grade >= grade.maxGrade * 0.9 ? 'success' :
                              grade.grade >= grade.maxGrade * 0.8 ? 'warning' : 'error'
                            }
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Stack>
                      </Stack>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {grade.className} • {new Date(grade.submittedAt).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Time Spent */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  ⏱️ Time Spent Learning
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={timeSpentData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          title: {
                            display: true,
                            text: 'Minutes',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Subject Progress */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  📚 Subject Progress
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Doughnut
                    data={subjectChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Subject Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  📋 Subject Details
                </Typography>
                <Stack spacing={2}>
                  {progressData?.subjectProgress.map((subject, index) => (
                    <Box key={index}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {subject.subject}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {subject.completed}/{subject.total}
                          </Typography>
                          <Chip
                            label={`${subject.averageGrade}%`}
                            size="small"
                            sx={{
                              bgcolor: `${subject.color}15`,
                              color: subject.color,
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(subject.completed / subject.total) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: subject.color,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Strengths & Areas for Improvement */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                      💪 Your Strengths
                    </Typography>
                    <Stack spacing={1}>
                      {progressData?.strengths.map((strength, index) => (
                        <Chip
                          key={index}
                          label={strength}
                          icon={<CheckCircle />}
                          color="success"
                          variant="outlined"
                          sx={{ justifyContent: 'flex-start' }}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'warning.main' }}>
                      🎯 Areas for Improvement
                    </Typography>
                    <Stack spacing={1}>
                      {progressData?.areasForImprovement.map((area, index) => (
                        <Chip
                          key={index}
                          label={area}
                          icon={<TrendingUp />}
                          color="warning"
                          variant="outlined"
                          sx={{ justifyContent: 'flex-start' }}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* Achievements Grid */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  🏆 Your Achievements
                </Typography>
                <Grid container spacing={3}>
                  {progressData?.achievements.map((achievement) => (
                    <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          border: '2px solid',
                          borderColor: getRarityColor(achievement.rarity),
                          borderRadius: 3,
                          position: 'relative',
                          background: `linear-gradient(135deg, ${getRarityColor(achievement.rarity)}08 0%, ${getRarityColor(achievement.rarity)}03 100%)`,
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                          }}
                        >
                          <Chip
                            label={achievement.rarity}
                            size="small"
                            sx={{
                              bgcolor: getRarityColor(achievement.rarity),
                              color: 'white',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          />
                        </Box>
                        <Typography variant="h2" sx={{ mb: 2 }}>
                          {achievement.icon}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          {achievement.description}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Achievement Stats */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <AlertTitle>Keep Going! 🚀</AlertTitle>
              You've unlocked {progressData?.achievements.length} achievements so far. 
              Complete more assignments and maintain your streak to unlock exclusive badges!
            </Alert>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Progress;
