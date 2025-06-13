import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Preview,
  Code,
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const CreateAssignment = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    classId: '',
    title: '',
    description: '',
    language: 'javascript',
    difficulty: 'beginner',
    skills: [],
    starterCode: '',
    totalPoints: 100,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 1 week from now
    testCases: [
      { input: '', expectedOutput: '', isHidden: false }
    ]
  });
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    // Set default starter code when language changes
    setFormData(prev => ({
      ...prev,
      starterCode: getDefaultCode(prev.language)
    }));
  }, [formData.language]);

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

  const getDefaultCode = (language) => {
    const defaults = {
      javascript: '// Write your JavaScript solution here\nfunction solve() {\n    // Your code here\n}\n\n// Example usage\nconsole.log(solve());',
      python: '# Write your Python solution here\ndef solve():\n    # Your code here\n    pass\n\n# Example usage\nprint(solve())',
      java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your Java solution here\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    printf("Hello, World!\\n");\n    return 0;\n}'
    };
    return defaults[language] || '// Write your code here';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      testCases: updatedTestCases
    }));
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: false }]
    }));
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length > 1) {
      setFormData(prev => ({
        ...prev,
        testCases: prev.testCases.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.classId) {
      setError('Please select a class');
      return false;
    }
    if (!formData.title.trim()) {
      setError('Please enter an assignment title');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please enter an assignment description');
      return false;
    }
    if (formData.totalPoints <= 0) {
      setError('Total points must be greater than 0');
      return false;
    }
    if (formData.testCases.some(tc => !tc.input.trim() || !tc.expectedOutput.trim())) {
      setError('All test cases must have input and expected output');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        dueDate: new Date(formData.dueDate)
      };
      
      await axios.post('/api/teacher/assignments', submitData, {
        withCredentials: true
      });
      
      // Reset form
      setFormData({
        classId: '',
        title: '',
        description: '',
        language: 'javascript',
        difficulty: 'beginner',
        skills: [],
        starterCode: getDefaultCode('javascript'),
        totalPoints: 100,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        testCases: [{ input: '', expectedOutput: '', isHidden: false }]
      });
      
      alert('Assignment created successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="Create Assignment"
          subtitle="Design coding challenges for your students"
        />
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Create Assignment"
        subtitle="Design coding challenges for your students"
      />

      <Grid container spacing={3}>
        {/* Assignment Details */}
        <Grid item xs={12} md={6}>
          <Card title="Assignment Details">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Class</InputLabel>
                <Select
                  value={formData.classId}
                  onChange={(e) => handleInputChange('classId', e.target.value)}
                  label="Class"
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.name} - {cls.subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Assignment Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={4}
                required
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Programming Language</InputLabel>
                    <Select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      label="Programming Language"
                    >
                      <MenuItem value="javascript">JavaScript</MenuItem>
                      <MenuItem value="python">Python</MenuItem>
                      <MenuItem value="java">Java</MenuItem>
                      <MenuItem value="cpp">C++</MenuItem>
                      <MenuItem value="c">C</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      label="Difficulty"
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Total Points"
                    type="number"
                    value={formData.totalPoints}
                    onChange={(e) => handleInputChange('totalPoints', parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>

              {/* Skills */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Skills Covered
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {formData.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    label="Add skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Code Editor */}
        <Grid item xs={12} md={6}>
          <Card title="Starter Code" subtitle="Provide initial code for students">
            <Box sx={{ height: 400, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Editor
                height="100%"
                language={formData.language === 'cpp' ? 'cpp' : formData.language}
                value={formData.starterCode}
                onChange={(value) => handleInputChange('starterCode', value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                }}
              />
            </Box>
          </Card>
        </Grid>

        {/* Test Cases */}
        <Grid item xs={12}>
          <Card
            title="Test Cases"
            subtitle="Define input/output pairs to validate student solutions"
            actions={
              <Button
                startIcon={<Add />}
                onClick={addTestCase}
                variant="outlined"
                size="small"
              >
                Add Test Case
              </Button>
            }
          >
            {formData.testCases.map((testCase, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, border: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    Test Case {index + 1}
                  </Typography>
                  {formData.testCases.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => removeTestCase(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Input"
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                      multiline
                      rows={3}
                      placeholder="Enter test input..."
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Expected Output"
                      value={testCase.expectedOutput}
                      onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                      multiline
                      rows={3}
                      placeholder="Enter expected output..."
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Preview />}
                disabled={submitting}
              >
                Preview
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Assignment'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateAssignment;