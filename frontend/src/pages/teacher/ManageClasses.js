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
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Fab,
} from '@mui/material';
import {
  Add,
  MoreVert,
  People,
  Assignment,
  ContentCopy,
  Edit,
  Archive,
  School,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    theme: 'blue'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/teacher/classes', {
        withCredentials: true
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!formData.name.trim() || !formData.subject.trim()) {
      setError('Name and subject are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/teacher/classes', formData, {
        withCredentials: true
      });
      
      setCreateDialogOpen(false);
      resetForm();
      fetchClasses();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClass = async () => {
    if (!formData.name.trim() || !formData.subject.trim()) {
      setError('Name and subject are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.put(`/api/teacher/classes/${selectedClass._id}`, formData, {
        withCredentials: true
      });
      
      setEditDialogOpen(false);
      resetForm();
      fetchClasses();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchiveClass = async (classId) => {
    try {
      await axios.delete(`/api/teacher/classes/${classId}`, {
        withCredentials: true
      });
      fetchClasses();
    } catch (error) {
      console.error('Failed to archive class:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      description: '',
      theme: 'blue'
    });
    setSelectedClass(null);
    setError('');
  };

  const handleMenuClick = (event, classItem) => {
    setMenuAnchor(event.currentTarget);
    setSelectedClass(classItem);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedClass(null);
  };

  const handleEditClick = () => {
    setFormData({
      name: selectedClass.name,
      subject: selectedClass.subject,
      description: selectedClass.description || '',
      theme: selectedClass.theme || 'blue'
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const copyClassCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a snackbar notification here
  };

  const getThemeColor = (theme) => {
    const colors = {
      blue: '#1976d2',
      green: '#4caf50',
      purple: '#9c27b0',
      orange: '#ff9800',
      red: '#f44336'
    };
    return colors[theme] || colors.blue;
  };

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="Manage Classes"
          subtitle="Create and manage your classes"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Manage Classes"
        subtitle="Create and manage your classes"
      />

      {classes.length === 0 ? (
        <Card>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Classes Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first class to start teaching and managing assignments.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Your First Class
            </Button>
          </Box>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {classes.map((classItem) => (
              <Grid item xs={12} sm={6} md={4} key={classItem._id}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${getThemeColor(classItem.theme)} 0%, ${getThemeColor(classItem.theme)}dd 100%)`,
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {classItem.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {classItem.subject}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, classItem)}
                      sx={{ color: 'white' }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {classItem.description && (
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                      {classItem.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <People sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {classItem.students?.length || 0} students
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
                        Class Code:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mr: 1 }}>
                          {classItem.code}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => copyClassCode(classItem.code)}
                          sx={{ color: 'white', opacity: 0.8 }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Floating Action Button */}
          <Fab
            color="primary"
            aria-label="add class"
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
          >
            <Add />
          </Fab>
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1 }} />
          Edit Class
        </MenuItem>
        <MenuItem onClick={() => {
          handleArchiveClass(selectedClass._id);
          handleMenuClose();
        }}>
          <Archive sx={{ mr: 1 }} />
          Archive Class
        </MenuItem>
      </Menu>

      {/* Create Class Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Class</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Class'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Class</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditClass}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Class'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageClasses;