import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  Grade,
  Timer,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const Progress = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get('/api/student/grades', {
        withCredentials: true
      });
      setGrades(response.data);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (grades.length === 0) {
      return {
        averageGrade: 0,
        totalAssignments: 0,
        highestGrade: 0,
        lowestGrade: 0,
      };
    }

    const gradeValues = grades.map(g => g.grade);
    return {
      averageGrade: Math.round(gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length),
      totalAssignments: grades.length,
      highestGrade: Math.max(...gradeValues),
      lowestGrade: Math.min(...gradeValues),
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'info';
    if (grade >= 70) return 'warning';
    return 'error';
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="My Progress"
          subtitle="Track your academic performance and improvement over time"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="My Progress"
        subtitle="Track your academic performance and improvement over time"
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.averageGrade}%
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
              <Assignment sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalAssignments}
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
              <Grade sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.highestGrade}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Highest Grade
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Timer sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.lowestGrade}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lowest Grade
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Grades List */}
      <Card title="Grade History" subtitle="Your assignment grades over time">
        {grades.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No grades yet. Complete some assignments to see your progress!
          </Typography>
        ) : (
          <Box>
            {grades.map((submission) => (
              <Paper
                key={submission._id}
                sx={{
                  p: 3,
                  mb: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="500" gutterBottom>
                      {submission.assignmentId?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {submission.assignmentId?.classId?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Graded on {formatDate(submission.gradedAt)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color={`${getGradeColor(submission.grade)}.main`}
                      gutterBottom
                    >
                      {submission.grade}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {submission.assignmentId?.totalPoints} points
                    </Typography>
                  </Box>
                </Box>

                {submission.teacherFeedback && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Teacher Feedback:
                    </Typography>
                    <Typography variant="body2">
                      {submission.teacherFeedback}
                    </Typography>
                  </Box>
                )}

                {/* Grade Progress Bar */}
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={submission.grade}
                    color={getGradeColor(submission.grade)}
                    sx={{ height: 8, borderRadius: 4 }}
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

export default Progress;