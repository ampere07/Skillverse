import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Code,
  Edit,
  FileCopy,
  Delete,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const AssignmentBank = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('/api/teacher/assignments', {
        withCredentials: true
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, assignment) => {
    setMenuAnchor(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedAssignment(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
          title="Assignment Bank"
          subtitle="Manage and reuse your assignment templates"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Assignment Bank"
        subtitle="Manage and reuse your assignment templates"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/assignments/create')}
          >
            Create Assignment
          </Button>
        }
      />

      {assignments.length === 0 ? (
        <Card>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Code sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Assignments Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first assignment to build your assignment bank.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/assignments/create')}
            >
              Create Assignment
            </Button>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {assignments.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment._id}>
              <Card hover>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="500" sx={{ flexGrow: 1 }}>
                    {assignment.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, assignment)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {assignment.classId?.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {assignment.description.substring(0, 100)}
                  {assignment.description.length > 100 && '...'}
                </Typography>

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
                  <Chip
                    label={`${assignment.totalPoints} pts`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {assignment.skills && assignment.skills.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Skills: {assignment.skills.join(', ')}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Created {formatDate(assignment.createdAt)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due {formatDate(assignment.dueDate)}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          Edit Assignment
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <FileCopy sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AssignmentBank;