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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
} from '@mui/material';
import { Add, Person, Assignment } from '@mui/icons-material';
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
    if (!classCode.trim()) return;

    setJoinLoading(true);
    try {
      await axios.post('/api/student/classes/join', { classCode });
      setJoinDialogOpen(false);
      setClassCode('');
      fetchClasses(); // Refresh the classes
    } catch (error) {
      console.error('Error joining class:', error);
    } finally {
      setJoinLoading(false);
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Classes
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View and manage your enrolled classes
      </Typography>

      {classes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't joined any classes yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click the + button to join a class
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {classes.map((classItem) => (
            <Grid item xs={12} md={6} lg={4} key={classItem._id}>
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
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {classItem.name.charAt(0).toUpperCase()}
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
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <Person sx={{ fontSize: 16, mr: 1 }} />
                      {classItem.teacherId.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Class Code: {classItem.code}
                    </Typography>
                  </Box>

                  {classItem.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {classItem.description}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={`Created ${new Date(classItem.createdAt).toLocaleDateString()}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Assignment />}
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

      {/* Join Class FAB */}
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

      {/* Join Class Dialog */}
      <Dialog
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Join a Class</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Class Code"
            fullWidth
            variant="outlined"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Enter the class code provided by your teacher"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleJoinClass}
            variant="contained"
            disabled={!classCode.trim() || joinLoading}
          >
            {joinLoading ? 'Joining...' : 'Join Class'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyClasses;