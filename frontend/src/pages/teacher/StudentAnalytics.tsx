import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Person, TrendingUp, Assignment, Grade } from '@mui/icons-material';

const StudentAnalytics: React.FC = () => {
  // Mock data for demonstration
  const classOverview = {
    totalStudents: 24,
    averageGrade: 82.5,
    completionRate: 88.3,
    activeAssignments: 5
  };

  const topPerformers = [
    { name: 'Alice Johnson', avgGrade: 94.5, completedAssignments: 12 },
    { name: 'Bob Smith', avgGrade: 91.2, completedAssignments: 11 },
    { name: 'Carol Davis', avgGrade: 89.8, completedAssignments: 12 },
    { name: 'David Wilson', avgGrade: 87.3, completedAssignments: 10 },
    { name: 'Eve Brown', avgGrade: 85.6, completedAssignments: 11 },
  ];

  const skillProgress = [
    { skill: 'JavaScript', average: 78.5, students: 24 },
    { skill: 'Python', average: 72.3, students: 18 },
    { skill: 'Data Structures', average: 65.8, students: 22 },
    { skill: 'Algorithms', average: 58.2, students: 20 },
    { skill: 'React', average: 71.4, students: 15 },
  ];

  const recentSubmissions = [
    { student: 'Alice Johnson', assignment: 'Binary Search', grade: 95, submittedAt: '2 hours ago' },
    { student: 'Bob Smith', assignment: 'Sorting Algorithms', grade: 88, submittedAt: '4 hours ago' },
    { student: 'Carol Davis', assignment: 'Binary Search', grade: 92, submittedAt: '6 hours ago' },
    { student: 'David Wilson', assignment: 'React Components', grade: 85, submittedAt: '1 day ago' },
    { student: 'Eve Brown', assignment: 'Sorting Algorithms', grade: 90, submittedAt: '1 day ago' },
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'success';
    if (grade >= 70) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Analytics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Monitor student progress and class performance
      </Typography>

      <Grid container spacing={3}>
        {/* Class Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Class Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <Person />
                    </Avatar>
                    <Typography variant="h6">{classOverview.totalStudents}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Students
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                      <Grade />
                    </Avatar>
                    <Typography variant="h6">{classOverview.averageGrade}%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Grade
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                      <TrendingUp />
                    </Avatar>
                    <Typography variant="h6">{classOverview.completionRate}%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completion Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                      <Assignment />
                    </Avatar>
                    <Typography variant="h6">{classOverview.activeAssignments}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Assignments
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performers
              </Typography>
              <List>
                {topPerformers.map((student, index) => (
                  <ListItem key={index} divider={index < topPerformers.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {student.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.name}
                      secondary={`${student.completedAssignments} assignments completed`}
                    />
                    <Chip
                      label={`${student.avgGrade}%`}
                      color={getGradeColor(student.avgGrade) as any}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Skill Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Progress Across Class
              </Typography>
              {skillProgress.map((skill, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">{skill.skill}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {skill.students} students
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {skill.average}%
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={skill.average}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Submissions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Submissions
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Assignment</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Submitted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentSubmissions.map((submission, index) => (
                      <TableRow key={index}>
                        <TableCell>{submission.student}</TableCell>
                        <TableCell>{submission.assignment}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${submission.grade}%`}
                            color={getGradeColor(submission.grade) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{submission.submittedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Assignment Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignment Performance Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Detailed analysis of how students are performing across different assignments and skill areas.
              </Typography>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  AI Insights
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Data Structures assignments have the lowest completion rate"
                      secondary="Consider providing additional resources or breaking down complex concepts"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="JavaScript assignments show consistently high performance"
                      secondary="Students are well-prepared in this area"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="5 students may need additional support"
                      secondary="Their recent submissions show declining performance"
                    />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentAnalytics;