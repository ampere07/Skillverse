import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
  Alert,
  Fab,
} from '@mui/material';
import {
  Add,
  MoreVert,
  ContentCopy,
  Edit,
  Delete,
  Group,
  Assignment,
} from '@mui/icons-material';
import axios from 'axios';

interface Class {
  _id: string;
  name: string;
  code: string;
  subject: string;
  description: string;
  students: string[];
  theme: string;
  createdAt: string;
}

const ManageClasses: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    description: '',
    theme: 'blue'
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/teacher/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!newClass.name || !newClass.subject) {
      setError('Name and subject are required');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const response = await axios.post('/api/teacher/classes', newClass);
      setClasses(prev => [response.data.class, ...prev]);
      setCreateDialogOpen(false);
      setNewClass({ name: '', subject: '', description: '', theme: 'blue' });
      setSuccess('Class created successfully!');
    } catch (error) {
      console.error('Error creating class:', error);
      const errorMessage = (error as any).response?.data?.message || 'Error creating class';
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, classItem: Class) => {
    setMenuAnchor(event.currentTarget);
    setSelectedClass(classItem);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedClass(null);
  };

  const copyClassCode = () => {
    if (selectedClass) {
      navigator.clipboard.writeText(selectedClass.code);
      setSuccess(`Class code ${selectedClass.code} copied to clipboard!`);
    }
    handleMenuClose();
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
        Manage Classes
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Create and manage your classes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {classes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No classes created yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first class to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Class
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
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {classItem.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, classItem)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {classItem.subject}
                  </Typography>
                  
                  {classItem.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {classItem.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={`Code: ${classItem.code}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Group fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {classItem.students.length} students
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Assignment fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        0 assignments
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button size="small" onClick={(e) => handleMenuOpen(e, classItem)}>
                    Manage
                  </Button>
                  <Button size="small" onClick={() => copyClassCode()}>
                    Copy Code
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={copyClassCode}>
          <ContentCopy sx={{ mr: 1 }} />
          Copy Class Code
        </MenuItemComponent>
        <MenuItemComponent onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          Edit Class
        </MenuItemComponent>
        <MenuItemComponent onClick={handleMenuClose}>
          <Delete sx={{ mr: 1 }} />
          Delete Class
        </MenuItemComponent>
      </Menu>

      {/* Create Class Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Class</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Class Name"
                value={newClass.name}
                onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Subject"
                value={newClass.subject}
                onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (Optional)"
                value={newClass.description}
                onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Theme Color</InputLabel>
                <Select
                  value={newClass.theme}
                  onChange={(e) => setNewClass(prev => ({ ...prev, theme: e.target.value }))}
                  label="Theme Color"
                >
                  <MenuItem value="blue">Blue</MenuItem>
                  <MenuItem value="green">Green</MenuItem>
                  <MenuItem value="purple">Purple</MenuItem>
                  <MenuItem value="orange">Orange</MenuItem>
                  <MenuItem value="red">Red</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Class'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default ManageClasses;