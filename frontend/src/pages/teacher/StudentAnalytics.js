import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  People,
  Assignment,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const StudentAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    classPerformance: [],
    topPerformers: [],
    skillDistribution: {},
    submissionTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/teacher/analytics', {
        withCredentials: true
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="Student Analytics"
          subtitle="Analyze student performance and progress across your classes"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Student Analytics"
        subtitle="Analyze student performance and progress across your classes"
      />

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Analytics sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {analyticsData.classPerformance.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Classes Analyzed
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
                  {analyticsData.classPerformance.reduce((sum, cls) => sum + cls.studentCount, 0)}
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
                  {analyticsData.classPerformance.reduce((sum, cls) => sum + cls.assignmentCount, 0)}
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
              <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  85%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Performance
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Class Performance */}
        <Grid item xs={12} md={8}>
          <Card title="Class Performance Overview" subtitle="Performance metrics for each of your classes">
            {analyticsData.classPerformance.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No class data available. Create classes and assignments to see analytics.
              </Typography>
            ) : (
              <Box>
                {analyticsData.classPerformance.map((classData) => (
                  <Box
                    key={classData.classId}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {classData.className}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Students
                        </Typography>
                        <Typography variant="h6">
                          {classData.studentCount}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Assignments
                        </Typography>
                        <Typography variant="h6">
                          {classData.assignmentCount}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Avg Grade
                        </Typography>
                        <Typography variant="h6">
                          {classData.averageGrade}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12} md={4}>
          <Card title="Top Performers" subtitle="Students with highest performance">
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <TrendingUp sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Top performer analytics coming soon! Complete more grading to see student rankings.
              </Typography>
            </Box>
          </Card>

          {/* Skill Distribution */}
          <Card title="Skill Distribution" subtitle="Student skill levels across topics" sx={{ mt: 3 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Analytics sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Skill distribution analytics coming soon! More student data needed for insights.
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Submission Trends */}
        <Grid item xs={12}>
          <Card title="Submission Trends" subtitle="Assignment submission patterns over time">
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Submission trend charts coming soon! Create more assignments to see submission patterns.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentAnalytics;