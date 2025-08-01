import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Button,
  Tab,
  Tabs,
  Alert,
  AlertTitle,
  Divider,
  Badge,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  Speed,
  EmojiEvents,
  Code,
  CheckCircle,
  Warning,
  Star,
  School,
  Assignment,
  Timeline,
  Psychology,
  LightbulbOutlined,
  RecommendOutlined,
  AutoGraphOutlined,
} from '@mui/icons-material';
import { Radar, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
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
  RadialLinearScale,
  BarElement
);

interface SkillData {
  overallSkillLevel: number;
  skillBreakdown: {
    [key: string]: {
      level: number;
      maxLevel: number;
      experience: number;
      nextLevelExp: number;
      color: string;
      description: string;
      badges: string[];
    };
  };
  learningPath: {
    current: string;
    completed: string[];
    upcoming: string[];
    recommendations: Array<{
      title: string;
      description: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      estimatedTime: number;
      skills: string[];
    }>;
  };
  competencyMap: {
    [category: string]: {
      score: number;
      maxScore: number;
      skills: Array<{
        name: string;
        proficiency: number;
        trend: 'improving' | 'stable' | 'declining';
      }>;
    };
  };
  personalizedInsights: Array<{
    type: 'strength' | 'improvement' | 'recommendation';
    title: string;
    description: string;
    actionItems: string[];
  }>;
  performanceMetrics: {
    codeQuality: number;
    problemSolving: number;
    conceptualUnderstanding: number;
    codingSpeed: number;
    debugging: number;
    collaboration: number;
  };
  comparativeAnalysis: {
    classAverage: number;
    percentile: number;
    ranking: number;
    totalStudents: number;
  };
}

const SkillsReport: React.FC = () => {
  const [skillsData, setSkillsData] = useState<SkillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Mock data
  const mockSkillsData: SkillData = {
    overallSkillLevel: 67,
    skillBreakdown: {
      'Java Fundamentals': {
        level: 8,
        maxLevel: 10,
        experience: 850,
        nextLevelExp: 1000,
        color: '#1976d2',
        description: 'Core Java concepts and syntax',
        badges: ['Syntax Master', 'Variable Virtuoso'],
      },
      'Object-Oriented Programming': {
        level: 6,
        maxLevel: 10,
        experience: 620,
        nextLevelExp: 800,
        color: '#9c27b0',
        description: 'Classes, inheritance, polymorphism',
        badges: ['Class Creator'],
      },
      'Data Structures': {
        level: 5,
        maxLevel: 10,
        experience: 450,
        nextLevelExp: 600,
        color: '#4caf50',
        description: 'Arrays, lists, trees, graphs',
        badges: ['Array Ace'],
      },
      'Algorithms': {
        level: 4,
        maxLevel: 10,
        experience: 320,
        nextLevelExp: 500,
        color: '#ff9800',
        description: 'Sorting, searching, optimization',
        badges: [],
      },
      'Problem Solving': {
        level: 7,
        maxLevel: 10,
        experience: 720,
        nextLevelExp: 900,
        color: '#f44336',
        description: 'Analytical thinking and debugging',
        badges: ['Debug Detective', 'Logic Legend'],
      },
      'Testing & Quality': {
        level: 3,
        maxLevel: 10,
        experience: 180,
        nextLevelExp: 300,
        color: '#00bcd4',
        description: 'Unit testing and code quality',
        badges: [],
      },
    },
    learningPath: {
      current: 'Advanced Data Structures',
      completed: [
        'Java Basics',
        'Control Structures',
        'Methods & Functions',
        'Basic OOP',
        'Arrays & Collections',
      ],
      upcoming: [
        'Advanced Algorithms',
        'Design Patterns',
        'Multithreading',
        'Database Integration',
        'Web Development',
      ],
      recommendations: [
        {
          title: 'Master Binary Trees',
          description: 'Strengthen your data structures knowledge with binary tree implementations',
          difficulty: 'intermediate',
          estimatedTime: 120,
          skills: ['Data Structures', 'Algorithms'],
        },
        {
          title: 'Exception Handling Mastery',
          description: 'Learn advanced exception handling patterns and best practices',
          difficulty: 'intermediate',
          estimatedTime: 90,
          skills: ['Java Fundamentals', 'Problem Solving'],
        },
        {
          title: 'Unit Testing Fundamentals',
          description: 'Start building robust applications with comprehensive testing',
          difficulty: 'beginner',
          estimatedTime: 150,
          skills: ['Testing & Quality'],
        },
      ],
    },
    competencyMap: {
      'Core Programming': {
        score: 85,
        maxScore: 100,
        skills: [
          { name: 'Syntax & Grammar', proficiency: 92, trend: 'stable' },
          { name: 'Variables & Types', proficiency: 88, trend: 'improving' },
          { name: 'Control Flow', proficiency: 85, trend: 'stable' },
          { name: 'Methods', proficiency: 82, trend: 'improving' },
        ],
      },
      'Object-Oriented Design': {
        score: 72,
        maxScore: 100,
        skills: [
          { name: 'Classes & Objects', proficiency: 78, trend: 'improving' },
          { name: 'Inheritance', proficiency: 68, trend: 'improving' },
          { name: 'Polymorphism', proficiency: 65, trend: 'stable' },
          { name: 'Encapsulation', proficiency: 75, trend: 'improving' },
        ],
      },
      'Problem Solving': {
        score: 78,
        maxScore: 100,
        skills: [
          { name: 'Logical Thinking', proficiency: 82, trend: 'improving' },
          { name: 'Debugging', proficiency: 76, trend: 'stable' },
          { name: 'Algorithm Design', proficiency: 70, trend: 'improving' },
          { name: 'Code Optimization', proficiency: 65, trend: 'stable' },
        ],
      },
    },
    personalizedInsights: [
      {
        type: 'strength',
        title: 'Strong Foundation in Java Basics',
        description: 'You have mastered the fundamental concepts of Java programming with excellent understanding of syntax and core concepts.',
        actionItems: [
          'Continue building on this strong foundation',
          'Apply these skills to more complex projects',
          'Help peers who are struggling with basics',
        ],
      },
      {
        type: 'improvement',
        title: 'Focus on Advanced Data Structures',
        description: 'Your data structures knowledge is developing well, but there\'s room for improvement in complex structures like trees and graphs.',
        actionItems: [
          'Practice implementing binary trees and BSTs',
          'Study graph algorithms like DFS and BFS',
          'Work on tree traversal problems',
        ],
      },
      {
        type: 'recommendation',
        title: 'Start Learning Testing Practices',
        description: 'Adding testing skills to your toolkit will make you a more well-rounded developer and improve your code quality.',
        actionItems: [
          'Learn JUnit testing framework',
          'Practice writing unit tests for your code',
          'Understand test-driven development principles',
        ],
      },
    ],
    performanceMetrics: {
      codeQuality: 78,
      problemSolving: 82,
      conceptualUnderstanding: 85,
      codingSpeed: 65,
      debugging: 76,
      collaboration: 88,
    },
    comparativeAnalysis: {
      classAverage: 72,
      percentile: 75,
      ranking: 8,
      totalStudents: 32,
    },
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSkillsData(mockSkillsData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'declining': return <Warning sx={{ color: 'error.main', fontSize: 16 }} />;
      default: return <span style={{ width: 16, height: 16, display: 'inline-block' }}>—</span>;
    }
  };

  const skillRadarData = {
    labels: Object.keys(skillsData?.skillBreakdown || {}),
    datasets: [
      {
        label: 'Your Skills',
        data: Object.values(skillsData?.skillBreakdown || {}).map(skill => skill.level),
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        borderColor: '#1976d2',
        pointBackgroundColor: '#1976d2',
        pointBorderColor: '#fff',
      },
    ],
  };

  const performanceBarData = {
    labels: Object.keys(skillsData?.performanceMetrics || {}),
    datasets: [
      {
        label: 'Your Performance',
        data: Object.values(skillsData?.performanceMetrics || {}),
        backgroundColor: [
          '#1976d2',
          '#9c27b0',
          '#4caf50',
          '#ff9800',
          '#f44336',
          '#00bcd4',
        ],
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
            <Assessment sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Analyzing your skills...
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Creating your personalized skills report
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
          🎯 Skills Report
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Comprehensive analysis of your Java programming skills and learning progress
        </Typography>
      </Box>

      {/* Overall Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg, #1976d2 0deg ${(skillsData?.overallSkillLevel || 0) * 3.6}deg, #e0e0e0 ${(skillsData?.overallSkillLevel || 0) * 3.6}deg 360deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {skillsData?.overallSkillLevel}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Overall
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Skill Level
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You're in the {skillsData && skillsData.overallSkillLevel >= 70 ? 'Advanced' : skillsData && skillsData.overallSkillLevel >= 40 ? 'Intermediate' : 'Beginner'} range
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                <EmojiEvents sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Class Ranking
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                #{skillsData?.comparativeAnalysis.ranking}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                out of {skillsData?.comparativeAnalysis.totalStudents} students
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.main', display: 'block', mt: 1 }}>
                {skillsData?.comparativeAnalysis.percentile}th percentile
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                <Psychology sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Learning Path
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'warning.main', mb: 1 }}>
                {skillsData?.learningPath.current}
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Chip
                  label={`${skillsData?.learningPath.completed.length} completed`}
                  size="small"
                  color="success"
                />
                <Chip
                  label={`${skillsData?.learningPath.upcoming.length} upcoming`}
                  size="small"
                  color="info"
                />
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
          <Tab icon={<AutoGraphOutlined />} label="Skill Breakdown" />
          <Tab icon={<Assessment />} label="Performance" />
          <Tab icon={<LightbulbOutlined />} label="Insights" />
          <Tab icon={<RecommendOutlined />} label="Recommendations" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Skills Radar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  🎯 Skills Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Radar
                    data={skillRadarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 10,
                          ticks: {
                            stepSize: 2,
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Individual Skills */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  📊 Skill Details
                </Typography>
                <Stack spacing={3}>
                  {Object.entries(skillsData?.skillBreakdown || {}).map(([skillName, skillData]) => (
                    <Box key={skillName}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: skillData.color,
                            }}
                          />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {skillName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Level {skillData.level}/{skillData.maxLevel}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(skillData.experience / skillData.nextLevelExp) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: skillData.color,
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                        {skillData.experience}/{skillData.nextLevelExp} XP to next level
                      </Typography>
                      {skillData.badges.length > 0 && (
                        <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                          {skillData.badges.map((badge, index) => (
                            <Chip
                              key={index}
                              label={badge}
                              size="small"
                              icon={<Star />}
                              sx={{
                                bgcolor: `${skillData.color}15`,
                                color: skillData.color,
                                '& .MuiChip-icon': { color: skillData.color },
                              }}
                            />
                          ))}
                        </Stack>
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Competency Map */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  🗺️ Competency Map
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(skillsData?.competencyMap || {}).map(([category, categoryData]) => (
                    <Grid item xs={12} md={4} key={category}>
                      <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          {category}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            Overall Score: {categoryData.score}/{categoryData.maxScore}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(categoryData.score / categoryData.maxScore) * 100}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Stack spacing={2}>
                          {categoryData.skills.map((skill, index) => (
                            <Box key={index}>
                              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {skill.name}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                  {getTrendIcon(skill.trend)}
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {skill.proficiency}%
                                  </Typography>
                                </Stack>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={skill.proficiency}
                                sx={{
                                  height: 4,
                                  borderRadius: 2,
                                  bgcolor: 'grey.200',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 2,
                                    bgcolor: skill.trend === 'improving' ? 'success.main' : 
                                             skill.trend === 'declining' ? 'error.main' : 'primary.main',
                                  },
                                }}
                              />
                            </Box>
                          ))}
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Performance Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  📈 Performance Metrics
                </Typography>
                <Box sx={{ height: 400 }}>
                  <Bar
                    data={performanceBarData}
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
                          beginAtZero: true,
                          max: 100,
                          title: {
                            display: true,
                            text: 'Performance Score',
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Skills',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Comparison with Class */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <AlertTitle>📊 Comparative Analysis</AlertTitle>
              You're performing {skillsData && skillsData.comparativeAnalysis.classAverage < skillsData.overallSkillLevel ? 'above' : 'below'} the class average of {skillsData?.comparativeAnalysis.classAverage}%. 
              Keep up the great work and continue practicing to improve your ranking!
            </Alert>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {skillsData?.personalizedInsights.map((insight, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: insight.type === 'strength' ? 'success.main' : 
                                insight.type === 'improvement' ? 'warning.main' : 'info.main',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {insight.type === 'strength' ? <CheckCircle /> : 
                       insight.type === 'improvement' ? <Warning /> : <RecommendOutlined />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {insight.description}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Action Items:
                      </Typography>
                      <Stack spacing={1}>
                        {insight.actionItems.map((item, itemIndex) => (
                          <Box key={itemIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                              }}
                            />
                            <Typography variant="body2">{item}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              🎯 Personalized Learning Recommendations
            </Typography>
          </Grid>
          {skillsData?.learningPath.recommendations.map((recommendation, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {recommendation.title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={recommendation.difficulty}
                        size="small"
                        color={getDifficultyColor(recommendation.difficulty) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                      <Chip
                        label={`${recommendation.estimatedTime} min`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {recommendation.description}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Skills you'll improve:
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                      {recommendation.skills.map((skill, skillIndex) => (
                        <Chip
                          key={skillIndex}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SkillsReport;
