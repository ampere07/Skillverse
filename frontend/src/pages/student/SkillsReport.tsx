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
  Badge,
} from '@mui/material';
import { 
  Star, 
  TrendingUp, 
  Code, 
  Psychology, 
  Speed, 
  School,
  EmojiEvents,
  Lightbulb
} from '@mui/icons-material';

const SkillsReport: React.FC = () => {
  const skillCategories = [
    {
      name: 'Programming Languages',
      skills: [
        { name: 'JavaScript', level: 75, trend: 'up' },
        { name: 'Python', level: 60, trend: 'up' },
        { name: 'Java', level: 45, trend: 'stable' },
        { name: 'C++', level: 30, trend: 'down' },
      ]
    },
    {
      name: 'Data Structures & Algorithms',
      skills: [
        { name: 'Arrays & Strings', level: 80, trend: 'up' },
        { name: 'Linked Lists', level: 65, trend: 'up' },
        { name: 'Trees & Graphs', level: 40, trend: 'stable' },
        { name: 'Dynamic Programming', level: 25, trend: 'up' },
      ]
    },
    {
      name: 'Web Development',
      skills: [
        { name: 'React', level: 80, trend: 'up' },
        { name: 'Node.js', level: 55, trend: 'up' },
        { name: 'CSS', level: 70, trend: 'stable' },
        { name: 'MongoDB', level: 35, trend: 'up' },
      ]
    }
  ];

  const achievements = [
    { name: 'First Assignment', icon: <Star />, earned: true, description: 'Complete your first assignment' },
    { name: 'JavaScript Master', icon: <Code />, earned: true, description: 'Achieve 70% proficiency in JavaScript' },
    { name: 'Problem Solver', icon: <Psychology />, earned: true, description: 'Solve 10 coding problems' },
    { name: 'Speed Demon', icon: <Speed />, earned: false, description: 'Complete an assignment in under 30 minutes' },
    { name: 'Scholar', icon: <School />, earned: false, description: 'Maintain 90% average for a month' },
    { name: 'Champion', icon: <EmojiEvents />, earned: false, description: 'Top performer in a class' },
  ];

  const recommendations = [
    {
      title: 'Focus on Tree Data Structures',
      description: 'Your algorithm skills are improving, but tree structures need attention.',
      priority: 'high'
    },
    {
      title: 'Practice Dynamic Programming',
      description: 'This is a key area for algorithmic thinking and interview preparation.',
      priority: 'medium'
    },
    {
      title: 'Expand Backend Knowledge',
      description: 'Consider learning more about databases and server-side development.',
      priority: 'low'
    }
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Skills Report
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Comprehensive analysis of your programming skills and progress
      </Typography>

      <Grid container spacing={3}>
        {/* Overall Skill Level */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                <Typography variant="h4">3</Typography>
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Overall Skill Level
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Intermediate Developer
              </Typography>
              <LinearProgress
                variant="determinate"
                value={65}
                sx={{ height: 8, borderRadius: 4, mt: 2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                65% to Advanced Level
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Skill Categories */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Breakdown
              </Typography>
              {skillCategories.map((category, categoryIndex) => (
                <Box key={categoryIndex} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {category.name}
                  </Typography>
                  {category.skills.map((skill, skillIndex) => (
                    <Box key={skillIndex} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">{skill.name}</Typography>
                          {getTrendIcon(skill.trend)}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {skill.level}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={skill.level}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Achievements
              </Typography>
              <List>
                {achievements.map((achievement, index) => (
                  <ListItem key={index} divider={index < achievements.length - 1}>
                    <ListItemIcon>
                      <Badge
                        badgeContent={achievement.earned ? <Star sx={{ fontSize: 12 }} /> : null}
                        color="primary"
                      >
                        <Avatar
                          sx={{
                            bgcolor: achievement.earned ? 'success.main' : 'grey.300',
                            width: 40,
                            height: 40
                          }}
                        >
                          {achievement.icon}
                        </Avatar>
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={achievement.name}
                      secondary={achievement.description}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: achievement.earned ? 'text.primary' : 'text.secondary'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Recommendations
              </Typography>
              <List>
                {recommendations.map((rec, index) => (
                  <ListItem key={index} divider={index < recommendations.length - 1}>
                    <ListItemIcon>
                      <Lightbulb color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={rec.title}
                      secondary={rec.description}
                    />
                    <Chip
                      label={rec.priority}
                      color={
                        rec.priority === 'high' ? 'error' :
                        rec.priority === 'medium' ? 'warning' : 'default'
                      }
                      size="small"
                    />
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

export default SkillsReport;