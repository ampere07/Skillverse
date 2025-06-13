import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  School,
  Person,
  Assignment,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const MyClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/student/classes', {
        withCredentials: true
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!classCode.trim()) {
      setError('Please enter a class code');
      return;
    }

    setJoinLoading(true);
    setError('');

    try {
      await axios.post('/api/student/classes/join', {
        classCode: classCode.trim()
      }, {
        withCredentials: true
      });
      
      setJoinDialogOpen(false);
      setClassCode('');
      fetchClasses(); // Refresh the classes list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join class');
    } finally {
      setJoinLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No upcoming assignments';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRandomColor = (index) => {
    const colors = ['primary', 'secondary', 'success', 'info', 'warning'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="My Classes"
          subtitle="Your enrolled classes and course materials"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="My Classes"
        subtitle="Your enrolled classes and course materials"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setJoinDialogOpen(true)}
          >
            Join Class
          </Button>
        }
      />

      {classes.length === 0 ? (
        <Card>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Classes Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Join your first class to get started with assignments and learning materials.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setJoinDialogOpen(true)}
            >
              Join a Class
            </Button>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {classes.map((classItem, index) => (
            <Grid item xs={12} sm={6} md={4} key={classItem._id}>
              <Card
                hover
                onClick={() => navigate('/assignments', { state: { classId: classItem._id } })}
                sx={{
                  background: `linear-gradient(135deg, ${
                    getRandomColor(index) === 'primary' ? '#1976d2' :
                    getRandomColor(index) === 'secondary' ? '#dc004e' :
                    getRandomColor(index) === 'success' ? '#4caf50' :
                    getRandomColor(index) === 'info' ? '#2196f3' : '#ff9800'
                  } 0%, ${
                    getRandomColor(index) === 'primary' ? '#1565c0' :
                    getRandomColor(index) === 'secondary' ? '#9a0036' :
                    getRandomColor(index) === 'success' ? '#388e3c' :
                    getRandomColor(index) === 'info' ? '#1976d2' : '#f57c00'
                  } 100%)`,
                  color: 'white',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {classItem.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {classItem.subject}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {classItem.teacherId?.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assignment sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {classItem.assignmentCount} assignments
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Next due:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(classItem.nextDueDate)}
                    </Typography>
                  </Box>
                  <ArrowForward sx={{ opacity: 0.8 }} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Join Class Dialog */}
      <Dialog
        open={joinDialogOpen}
        onClose={() => {
          setJoinDialogOpen(false);
          setClassCode('');
          setError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Join Class</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the class code provided by your teacher to join the class.
          </Typography>
          <TextField
            fullWidth
            label="Class Code"
            value={classCode}
            onChange={(e) => {
              setClassCode(e.target.value.toUpperCase());
              if (error) setError('');
            }}
            placeholder="e.g., ABC123"
            error={!!error}
            helperText={error}
            sx={{ mt: 1 }}
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setJoinDialogOpen(false);
              setClassCode('');
              setError('');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoinClass}
            variant="contained"
            disabled={joinLoading || !classCode.trim()}
          >
            {joinLoading ? 'Joining...' : 'Join Class'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyClasses;