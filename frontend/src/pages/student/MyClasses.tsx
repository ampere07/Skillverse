import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Avatar,
  Fab,
} from '@mui/material';
import { Add, Assignment, Person, School } from '@mui/icons-material';
import axios from 'axios';

interface Class {
  _id: string;
  name: string;
  code: string;
  subject: string;
  description: string;
  teacherId: {
    name: string;
    email: string;
  };
  theme: string;
  createdAt: string;
}

const MyClasses: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/student/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
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
      await axios.post('/api/student/classes/join', { classCode });
      setSuccess('Successfully joined the class!');
      setJoinDialogOpen(false);
      setClassCode('');
      fetchClasses(); // Refresh classes
    } catch (error) {
      console.error('Error joining class:', error);
      const errorMessage = (error as any).response?.data?.message || 'Failed to join class';
      setError(errorMessage);
    } finally {
      setJoinLoading(false);
    }
  };

  const getThemeColor = (theme: string) => {
    const themes: { [key: string]: string } = {
      blue: '#1976d2',
      green: '#388e3c',
      purple: '#7b1fa2',
      orange: '#f57c00',
      red: '#d32f2f',
    };
    return themes[theme] || themes.blue;
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Classes
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View your enrolled classes and access assignments
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {classes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No classes joined yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join your first class using a class code from your teacher
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setJoinDialogOpen(true)}
          >
            Join Class
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {classes.map((classItem) => (
            <Grid item xs={12} md={6} lg={4} key={classItem._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: 4,
                  borderTopColor: getThemeColor(classItem.theme),
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: getThemeColor(classItem.theme),
                        mr: 2,
                      }}
                    >
                      <School />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2">
                        {classItem.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {classItem.subject}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {classItem.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {classItem.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.teacherId.name}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={`Code: ${classItem.code}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Assignment />}
                    component={Link}
                    to="/assignments"
                    fullWidth
                  >
                    View Assignments
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Join Class Dialog */}
      <Dialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join Class</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Class Code"
            fullWidth
            variant="outlined"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-digit class code"
            inputProps={{ maxLength: 6 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleJoinClass}
            variant="contained"
            disabled={joinLoading}
          >
            {joinLoading ? 'Joining...' : 'Join Class'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="join class"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setJoinDialogOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default MyClasses;