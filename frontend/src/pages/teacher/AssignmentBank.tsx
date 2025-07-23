import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, Visibility, ContentCopy } from '@mui/icons-material';
import { Editor } from '@monaco-editor/react';

interface AssignmentTemplate {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: string;
  skills: string[];
  starterCode: string;
  category: string;
}

const AssignmentBank: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AssignmentTemplate | null>(null);

  const assignmentTemplates: AssignmentTemplate[] = [
    {
      id: '1',
      title: 'Two Sum Problem',
      description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
      language: 'javascript',
      difficulty: 'beginner',
      skills: ['Arrays', 'Hash Tables', 'Problem Solving'],
      starterCode: `function twoSum(nums, target) {
    // Your code here
    
}`,
      category: 'Algorithms'
    },
    {
      id: '2',
      title: 'Binary Search Tree Implementation',
      description: 'Implement a binary search tree with insert, search, and delete operations.',
      language: 'javascript',
      difficulty: 'intermediate',
      skills: ['Trees', 'Data Structures', 'Recursion'],
      starterCode: `class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }
    
    // Implement your methods here
}`,
      category: 'Data Structures'
    },
    {
      id: '3',
      title: 'React Todo App',
      description: 'Build a complete todo application using React hooks with add, edit, delete, and filter functionality.',
      language: 'javascript',
      difficulty: 'intermediate',
      skills: ['React', 'Hooks', 'State Management', 'Event Handling'],
      starterCode: `import React, { useState } from 'react';

function TodoApp() {
    const [todos, setTodos] = useState([]);
    
    // Implement your component logic here
    
    return (
        <div>
            <h1>Todo App</h1>
            {/* Your JSX here */}
        </div>
    );
}

export default TodoApp;`,
      category: 'Web Development'
    },
    {
      id: '4',
      title: 'Merge Sort Algorithm',
      description: 'Implement the merge sort algorithm with proper time and space complexity analysis.',
      language: 'python',
      difficulty: 'advanced',
      skills: ['Sorting', 'Divide and Conquer', 'Recursion', 'Algorithm Analysis'],
      starterCode: `def merge_sort(arr):
    """
    Implement merge sort algorithm
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    # Your code here
    pass

def merge(left, right):
    """
    Helper function to merge two sorted arrays
    """
    # Your code here
    pass`,
      category: 'Algorithms'
    },
    {
      id: '5',
      title: 'Database Design Project',
      description: 'Design and implement a relational database schema for a library management system.',
      language: 'sql',
      difficulty: 'intermediate',
      skills: ['Database Design', 'SQL', 'Normalization', 'Relationships'],
      starterCode: `-- Create tables for library management system

-- Books table
CREATE TABLE books (
    -- Define your schema here
);

-- Authors table
CREATE TABLE authors (
    -- Define your schema here
);

-- Add more tables as needed`,
      category: 'Database'
    }
  ];

  const filteredTemplates = assignmentTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = !selectedLanguage || template.language === selectedLanguage;
    const matchesDifficulty = !selectedDifficulty || template.difficulty === selectedDifficulty;
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    
    return matchesSearch && matchesLanguage && matchesDifficulty && matchesCategory;
  });

  const handlePreview = (template: AssignmentTemplate) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleUseTemplate = (template: AssignmentTemplate) => {
    // This would typically navigate to create assignment page with pre-filled data
    console.log('Using template:', template);
    alert('Template copied! Navigate to Create Assignment to use it.');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assignment Bank
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Browse and use pre-built assignment templates
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  label="Language"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="sql">SQL</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  label="Difficulty"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Algorithms">Algorithms</MenuItem>
                  <MenuItem value="Data Structures">Data Structures</MenuItem>
                  <MenuItem value="Web Development">Web Development</MenuItem>
                  <MenuItem value="Database">Database</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLanguage('');
                  setSelectedDifficulty('');
                  setSelectedCategory('');
                }}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {template.title}
                  </Typography>
                  <Chip
                    label={template.difficulty}
                    color={getDifficultyColor(template.difficulty) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={template.language.toUpperCase()}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={template.category}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {template.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handlePreview(template)}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<ContentCopy />}
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No templates found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters
          </Typography>
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedTemplate?.description}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Skills:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedTemplate?.skills.map((skill, index) => (
                <Chip key={index} label={skill} size="small" />
              ))}
            </Box>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            Starter Code:
          </Typography>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Editor
              height="300px"
              language={selectedTemplate?.language || 'javascript'}
              value={selectedTemplate?.starterCode || ''}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<ContentCopy />}
            onClick={() => {
              if (selectedTemplate) {
                handleUseTemplate(selectedTemplate);
                setPreviewOpen(false);
              }
            }}
          >
            Use Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignmentBank;