import React, { useState, useEffect } from 'react';
import {
  Grid,
  Tabs,
  Tab,
  Box,
  Typography,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Schedule,
  Warning,
  Code,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const Assignments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    fetchAssignments();
  }, [currentTab]);

  const fetchAssignments = async () => {
    try {
      const filters = ['all', 'todo', 'completed', 'missing'];
      const response = await axios.get(`/api/student/assignments?filter=${filters[currentTab]}`, {
        withCredentials: true
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setLoading(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 1) return `Due in ${diffDays} days`;
    return 'Overdue';
  };

  const getStatusIcon = (status, dueDate) => {
    if (status === 'graded') {
      return <CheckCircle color="success" />;
    }
    if (status === 'pending') {
      return <Schedule color="info" />;
    }
    if (new Date(dueDate) < new Date()) {
      return <Warning color="error" />;
    }
    return <PlayArrow color="primary" />;
  };

  const getStatusText = (status, dueDate) => {
    if (status === 'graded') {
      return 'Completed';
    }
    if (status === 'pending') {
      return 'Submitted';
    }
    if (new Date(dueDate) < new Date()) {
      return 'Missing';
    }
    return 'To Do';
  };

  const getButtonText = (status) => {
    if (status === 'graded') {
      return 'View Results';
    }
    if (status === 'pending') {
      return 'View Submission';
    }
    return 'Start Assignment';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="Assignments"
          subtitle="View and complete your coding assignments"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Assignments"
        subtitle="View and complete your coding assignments"
      />

      {/* Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="All" />
          <Tab label="To Do" />
          <Tab label="Completed" />
          <Tab label="Missing" />
        </Tabs>
      </Box>

      {assignments.length === 0 ? (
        <Card>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Code sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Assignments Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentTab === 0 && "You don't have any assignments yet. Join a class to get started!"}
              {currentTab === 1 && "Great job! No assignments are due right now."}
              {currentTab === 2 && "No completed assignments yet. Start working on your assignments!"}
              {currentTab === 3 && "No missing assignments. Keep up the great work!"}
            </Typography>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {assignments.map((assignment) => (
            <Grid item xs={12} md={6} lg={4} key={assignment._id}>
              <Card
                hover
                onClick={() => navigate(`/assignments/${assignment._id}/code`)}
              >
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="500">
                      {assignment.title}
                    </Typography>
                    {getStatusIcon(assignment.submissionStatus, assignment.dueDate)}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {assignment.classId?.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {assignment.description.substring(0, 100)}
                    {assignment.description.length > 100 && '...'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    label={assignment.language}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={assignment.difficulty}
                    size="small"
                    color={getDifficultyColor(assignment.difficulty)}
                  />
                  {assignment.grade && (
                    <Chip
                      label={`${assignment.grade}%`}
                      size="small"
                      color={assignment.grade >= 90 ? 'success' : assignment.grade >= 70 ? 'warning' : 'error'}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Due: {formatDate(assignment.dueDate)}
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {assignment.totalPoints} points
                    </Typography>
                  </Box>
                  <Chip
                    label={getStatusText(assignment.submissionStatus, assignment.dueDate)}
                    size="small"
                    color={
                      assignment.submissionStatus === 'graded' ? 'success' :
                      assignment.submissionStatus === 'pending' ? 'info' :
                      new Date(assignment.dueDate) < new Date() ? 'error' : 'primary'
                    }
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Code />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/assignments/${assignment._id}/code`);
                  }}
                >
                  {getButtonText(assignment.submissionStatus)}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Assignments;