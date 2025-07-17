import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import { Assignment, PlayArrow, CheckCircle, Schedule } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface AssignmentItem {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  difficulty: string;
  skills: string[];
  totalPoints: number;
  classId: {
    name: string;
  };
  status: 'todo' | 'submitted' | 'completed';
  submission?: any;
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('/api/student/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getFilteredAssignments = () => {
    switch (selectedTab) {
      case 0:
        return assignments; // All
      case 1:
        return assignments.filter(a => a.status === 'todo'); // To Do
      case 2:
        return assignments.filter(a => a.status === 'completed'); // Completed
      case 3:
        return assignments.filter(a => new Date(a.dueDate) < new Date() && a.status === 'todo'); // Missing
      default:
        return assignments;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'submitted':
        return <Schedule color="warning" />;
      default:
        return <Assignment color="action" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'submitted':
        return 'warning';
      default:
        return 'default';
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

  const filteredAssignments = getFilteredAssignments();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assignments
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View and complete your coding assignments
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="All" />
          <Tab label="To Do" />
          <Tab label="Completed" />
          <Tab label="Missing" />
        </Tabs>
      </Box>

      {filteredAssignments.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No assignments found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {selectedTab === 0 ? 'No assignments available' : 'No assignments in this category'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAssignments.map((assignment) => (
            <Grid item xs={12} md={6} lg={4} key={assignment._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      {getStatusIcon(assignment.status)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2">
                        {assignment.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assignment.classId.name}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {assignment.description.substring(0, 100)}
                    {assignment.description.length > 100 && '...'}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Points: {assignment.totalPoints}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={assignment.difficulty}
                      color={
                        assignment.difficulty === 'beginner' ? 'success' :
                        assignment.difficulty === 'intermediate' ? 'warning' : 'error'
                      }
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={assignment.status}
                      color={getStatusColor(assignment.status) as any}
                      size="small"
                    />
                  </Box>

                  {assignment.skills.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {assignment.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {assignment.submission && assignment.submission.grade && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={`Grade: ${assignment.submission.grade}%`}
                        color={assignment.submission.grade >= 90 ? 'success' : assignment.submission.grade >= 70 ? 'warning' : 'error'}
                        size="small"
                      />
                    </Box>
                  )}
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PlayArrow />}
                    component={Link}
                    to={`/assignment/${assignment._id}`}
                    fullWidth
                  >
                    {assignment.status === 'todo' ? 'Start' : 'Continue'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Assignments;