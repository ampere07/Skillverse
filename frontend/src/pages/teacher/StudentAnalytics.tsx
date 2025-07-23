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
  ListItemAvatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { 
  Person, 
  TrendingUp, 
  Assignment,
  Analytics,
} from '@mui/icons-material';

const StudentAnalytics: React.FC = () => {
  const classPerformance = {
    averageGrade: 78,
    completionRate: 85,
    totalStudents: 24,
    activeStudents: 20
  };

  const topPerformers = [
    { name: 'Alice Johnson', grade: 95, assignments: 12 },
    { name: 'Bob Smith', grade: 92, assignments: 11 },
    { name: 'Carol Davis', grade: 89, assignments: 12 },
    { name: 'David Wilson', grade: 87, assignments: 10 },
    { name: 'Eva Brown', grade: 85, assignments: 11 }
  ];

  const skillsAnalysis = [
    { skill: 'JavaScript Fundamentals', average: 82, trend: 'up' },
    { skill: 'Data Structures', average: 75, trend: 'up' },
    { skill: 'Algorithms', average: 68, trend: 'stable' },
    { skill: 'Problem Solving', average: 79, trend: 'up' },
    { skill: 'Code Quality', average: 71, trend: 'down' }
  ];

  const recentSubmissions = [
    { student: 'Alice Johnson', assignment: 'Binary Search Tree', grade: 95, date: '2024-01-15' },
    { student: 'Bob Smith', assignment: 'Sorting Algorithms', grade: 88, date: '2024-01-14' },
    { student: 'Carol Davis', assignment: 'Hash Tables', grade: 92, date: '2024-01-14' },
    { student: 'David Wilson', assignment: 'Graph Traversal', grade: 85, date: '2024-01-13' },
    { student: 'Eva Brown', assignment: 'Dynamic Programming', grade: 78, date: '2024-01-13' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" sx={{ fontSize: 16 }} />;
      case 'down':
        return <TrendingUp color="error" sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />;
      default:
        return null;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'warning';
    if (grade >= 70) return 'info';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Analytics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Comprehensive analysis of student performance and progress
      </Typography>

      <Grid container spacing={3}>
        {/* Class Overview */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                <Analytics />
              </Avatar>
              <Typography variant="h4" gutterBottom>
                {classPerformance.averageGrade}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Class Average
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                <Assignment />
              </Avatar>
              <Typography variant="h4" gutterBottom>
                {classPerformance.completionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completion Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                <Person />
              </Avatar>
              <Typography variant="h4" gutterBottom>
                {classPerformance.totalStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h4" gutterBottom>
                {classPerformance.activeStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12} md={6}>
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
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.name}
                      secondary={`${student.assignments} assignments completed`}
                    />
                    <Chip
                      label={`${student.grade}%`}
                      color={getGradeColor(student.grade) as any}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills Analysis
              </Typography>
              {skillsAnalysis.map((skill, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{skill.skill}</Typography>
                      {getTrendIcon(skill.trend)}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {skill.average}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={skill.average}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Submissions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Submissions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Assignment</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Date</TableCell>
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
                        <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentAnalytics;