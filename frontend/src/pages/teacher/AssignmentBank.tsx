import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Menu,
  Tooltip,
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Assignment, 
  MoreVert, 
  Edit, 
  Delete, 
  ContentCopy,
  Star,
  StarBorder
} from '@mui/icons-material';

interface AssignmentTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  skills: string[];
  estimatedTime: string;
  isFavorite: boolean;
  usageCount: number;
  lastUsed: string;
  tags: string[];
}

const AssignmentBank: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Mock data for assignment templates
  const assignmentTemplates: AssignmentTemplate[] = [
    {
      id: '1',
      title: 'Binary Search Implementation',
      description: 'Implement the binary search algorithm to find elements in a sorted array efficiently.',
      difficulty: 'intermediate',
      language: 'JavaScript',
      skills: ['Algorithms', 'Search', 'Arrays'],
      estimatedTime: '45 minutes',
      isFavorite: true,
      usageCount: 12,
      lastUsed: '2 days ago',
      tags: ['sorting', 'algorithms', 'arrays']
    },
    {
      id: '2',
      title: 'React Todo App',
      description: 'Build a complete todo application using React with state management and local storage.',
      difficulty: 'advanced',
      language: 'JavaScript',
      skills: ['React', 'State Management', 'Local Storage'],
      estimatedTime: '2 hours',
      isFavorite: false,
      usageCount: 8,
      lastUsed: '1 week ago',
      tags: ['react', 'frontend', 'state']
    },
    {
      id: '3',
      title: 'Linked List Operations',
      description: 'Implement basic operations on a singly linked list: insertion, deletion, and traversal.',
      difficulty: 'beginner',
      language: 'Python',
      skills: ['Data Structures', 'Linked Lists'],
      estimatedTime: '1 hour',
      isFavorite: true,
      usageCount: 15,
      lastUsed: '3 days ago',
      tags: ['data-structures', 'linked-list']
    },
    {
      id: '4',
      title: 'Dynamic Programming - Fibonacci',
      description: 'Solve the Fibonacci sequence using dynamic programming techniques.',
      difficulty: 'intermediate',
      language: 'Python',
      skills: ['Dynamic Programming', 'Recursion', 'Optimization'],
      estimatedTime: '30 minutes',
      isFavorite: false,
      usageCount: 6,
      lastUsed: '5 days ago',
      tags: ['dynamic-programming', 'fibonacci', 'recursion']
    },
    {
      id: '5',
      title: 'REST API with Express',
      description: 'Create a RESTful API using Node.js and Express with CRUD operations.',
      difficulty: 'advanced',
      language: 'JavaScript',
      skills: ['Node.js', 'Express', 'API Design', 'HTTP'],
      estimatedTime: '3 hours',
      isFavorite: false,
      usageCount: 4,
      lastUsed: '2 weeks ago',
      tags: ['backend', 'api', 'express', 'crud']
    },
    {
      id: '6',
      title: 'Sorting Algorithms Comparison',
      description: 'Implement and compare different sorting algorithms: bubble sort, quick sort, and merge sort.',
      difficulty: 'intermediate',
      language: 'Java',
      skills: ['Algorithms', 'Sorting', 'Performance Analysis'],
      estimatedTime: '1.5 hours',
      isFavorite: true,
      usageCount: 20,
      lastUsed: '1 day ago',
      tags: ['sorting', 'algorithms', 'performance']
    }
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleFavorite = (id: string) => {
    // Implementation to toggle favorite status
    console.log('Toggle favorite for:', id);
  };

  const getDifficultyColor = (difficulty: string) => {
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

  const filteredAssignments = assignmentTemplates.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = !difficultyFilter || assignment.difficulty === difficultyFilter;
    const matchesLanguage = !languageFilter || assignment.language === languageFilter;
    
    return matchesSearch && matchesDifficulty && matchesLanguage;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assignment Bank
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Browse and manage your assignment templates
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              label="Difficulty"
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              label="Language"
            >
              <MenuItem value="">All Languages</MenuItem>
              <MenuItem value="JavaScript">JavaScript</MenuItem>
              <MenuItem value="Python">Python</MenuItem>
              <MenuItem value="Java">Java</MenuItem>
              <MenuItem value="C++">C++</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ height: '56px' }}
          >
            More Filters
          </Button>
        </Grid>
      </Grid>

      {/* Assignment Cards */}
      <Grid container spacing={3}>
        {filteredAssignments.map((assignment) => (
          <Grid item xs={12} md={6} lg={4} key={assignment.id}>
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
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <Assignment />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h3">
                        {assignment.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assignment.language}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={assignment.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                      <IconButton
                        onClick={() => toggleFavorite(assignment.id)}
                        size="small"
                      >
                        {assignment.isFavorite ? <Star color="warning" /> : <StarBorder />}
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={handleMenuOpen}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {assignment.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={assignment.difficulty}
                    color={getDifficultyColor(assignment.difficulty) as any}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={assignment.estimatedTime}
                    variant="outlined"
                    size="small"
                  />
                </Box>

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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Used {assignment.usageCount} times
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {assignment.lastUsed}
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions>
                <Button size="small" variant="outlined" startIcon={<ContentCopy />}>
                  Use Template
                </Button>
                <Button size="small" variant="contained">
                  Preview
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredAssignments.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No assignments found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search criteria or filters
          </Typography>
        </Box>
      )}

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          Edit Template
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ContentCopy sx={{ mr: 1 }} />
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