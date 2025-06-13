import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  LinearProgress,
  Paper,
  Chip,
} from '@mui/material';
import {
  Code,
  Psychology,
  TrendingUp,
  EmojiEvents,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const SkillsReport = () => {
  const [skillsData, setSkillsData] = useState({
    skillLevels: {},
    skillProgress: {},
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const fetchSkillsData = async () => {
    try {
      const response = await axios.get('/api/student/skills', {
        withCredentials: true
      });
      setSkillsData(response.data);
    } catch (error) {
      console.error('Failed to fetch skills data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillLevel = (score) => {
    if (score >= 80) return { level: 'Expert', color: 'success' };
    if (score >= 60) return { level: 'Intermediate', color: 'info' };
    if (score >= 40) return { level: 'Beginner', color: 'warning' };
    return { level: 'Novice', color: 'error' };
  };

  const calculateOverallLevel = () => {
    const skills = Object.values(skillsData.skillLevels);
    if (skills.length === 0) return 0;
    return Math.round(skills.reduce((a, b) => a + b, 0) / skills.length);
  };

  const getSkillIcon = (skillName) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      algorithms: '🧮',
      dataStructures: '🏗️'
    };
    return icons[skillName] || '💻';
  };

  const formatSkillName = (skillName) => {
    const names = {
      javascript: 'JavaScript',
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      algorithms: 'Algorithms',
      dataStructures: 'Data Structures'
    };
    return names[skillName] || skillName;
  };

  const overallLevel = calculateOverallLevel();
  const overallSkillInfo = getSkillLevel(overallLevel);

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="Skills Report"
          subtitle="Track your programming skills and get personalized recommendations"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Skills Report"
        subtitle="Track your programming skills and get personalized recommendations"
      />

      {/* Overall Skill Level */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <Box sx={{ textAlign: 'center' }}>
              <Psychology sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {overallLevel}%
              </Typography>
              <Chip
                label={overallSkillInfo.level}
                color={overallSkillInfo.color}
                size="large"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Overall Skill Level
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <Box sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                +12%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Improvement This Month
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <Box sx={{ textAlign: 'center' }}>
              <EmojiEvents sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Skills Improved
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Individual Skills */}
        <Grid item xs={12} md={8}>
          <Card title="Skill Breakdown" subtitle="Your proficiency in different programming areas">
            {Object.keys(skillsData.skillLevels).length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                Complete assignments to see your skill progression!
              </Typography>
            ) : (
              <Box>
                {Object.entries(skillsData.skillLevels).map(([skill, level]) => {
                  const skillInfo = getSkillLevel(level);
                  return (
                    <Paper
                      key={skill}
                      sx={{
                        p: 3,
                        mb: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ mr: 1 }}>
                            {getSkillIcon(skill)}
                          </Typography>
                          <Typography variant="h6" fontWeight="500">
                            {formatSkillName(skill)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip
                            label={skillInfo.level}
                            color={skillInfo.color}
                            size="small"
                          />
                          <Typography variant="h6" fontWeight="bold">
                            {level}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <LinearProgress
                        variant="determinate"
                        value={level}
                        color={skillInfo.color}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Paper>
                  );
                })}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={4}>
          <Card title="Recommendations" subtitle="Areas to focus on next">
            {skillsData.recommendations.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Code sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Complete more assignments to get personalized AI recommendations!
                </Typography>
              </Box>
            ) : (
              <Box>
                {skillsData.recommendations.map((recommendation, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2">
                      {recommendation}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Card>

          {/* Achievement Badges */}
          <Card title="Achievements" subtitle="Your coding milestones" sx={{ mt: 3 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <EmojiEvents sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Achievement system coming soon! Keep coding to unlock badges.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillsReport;