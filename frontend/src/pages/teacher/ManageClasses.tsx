import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { 
  Add, 
  MoreVert, 
  Assignment, 
  ContentCopy,
  Edit,
  Delete,
  Class
} from '@mui/icons-material';
import axios from 'axios';

interface ClassItem {
  _id: string;
  name: string;
  code: string;
  subject: string;
  description: string;
  students: Array<{
    name: string;
    email: string;
  }>;
  theme: string;
  createdAt: string;
}

const ManageClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    theme: 'blue',
  });
  const [creating, setCreating] = useState(false);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, classItem: ClassItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedClass(classItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClass(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    handleMenuClose();
  };

  const handleCreateClass = async () => {
    if (!formData.name || !formData.subject) return;

    setCreating(true);
    try {
      await axios.post('/api/teacher/classes', formData);
      setCreateDialogOpen(false);
      setFormData({ name: '', subject: '', description: '', theme: 'blue' });
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      {classes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't created any classes yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click the + button to create your first class
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                        <Class />
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
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, classItem)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Class Code: <strong>{classItem.code}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Students: {classItem.students.length}
                    </Typography>
                  </Box>

                  {classItem.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {classItem.description}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={`Created ${new Date(classItem.createdAt).toLocaleDateString()}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Recent Students */}
                  {classItem.students.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Recent Students:
                      </Typography>
                      <List dense>
                        {classItem.students.slice(0, 3).map((student, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ width: 24, height: 24 }}>
                                {student.name.charAt(0).toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={student.name}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                        {classItem.students.length > 3 && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary={`+${classItem.students.length - 3} more`}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  )}
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Assignment />}
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleCopyCode(selectedClass?.code || '')}>
          <ContentCopy sx={{ mr: 1 }} />
          Copy Class Code
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          Edit Class
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Delete sx={{ mr: 1 }} />
          Delete Class
        </MenuItem>
      </Menu>

      {/* Create Class FAB */}
      <Fab
        color="primary"
        aria-label="create class"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* Create Class Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Class</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Class Name"
            name="name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Subject"
            name="subject"
            fullWidth
            variant="outlined"
            value={formData.subject}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={!formData.name || !formData.subject || creating}
          >
            {creating ? 'Creating...' : 'Create Class'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageClasses;