import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  IconButton,
} from '@mui/material';
import { Editor } from '@monaco-editor/react';
import { Add, Delete, Save } from '@mui/icons-material';
import axios from 'axios';

interface Class {
  _id: string;
  name: string;
  subject: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

const CreateAssignment: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [formData, setFormData] = useState({
    classId: '',
    title: '',
    description: '',
    starterCode: '',
    language: 'javascript',
    difficulty: 'beginner',
    skills: [] as string[],
    dueDate: '',
    totalPoints: 100
  });
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', expectedOutput: '', isHidden: false }
  ]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/teacher/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addTestCase = () => {
    setTestCases(prev => [...prev, { input: '', expectedOutput: '', isHidden: false }]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string | boolean) => {
    setTestCases(prev => prev.map((testCase, i) => 
      i === index ? { ...testCase, [field]: value } : testCase
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const assignmentData = {
        ...formData,
        testCases: testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim())
      };

      await axios.post('/api/teacher/assignments', assignmentData);
      setSuccess('Assignment created successfully!');
      
      // Reset form
      setFormData({
        classId: '',
        title: '',
        description: '',
        starterCode: '',
        language: 'javascript',
        difficulty: 'beginner',
        skills: [],
        dueDate: '',
        totalPoints: 100
      });
      setTestCases([{ input: '', expectedOutput: '', isHidden: false }]);
    } catch (error) {
      console.error('Error creating assignment:', error);
      const errorMessage = (error as any).response?.data?.message || 'Error creating assignment. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Assignment
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Create a new coding assignment for your students
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Class</InputLabel>
                      <Select
                        value={formData.classId}
                        onChange={(e) => handleSelectChange('classId', e.target.value)}
                        label="Class"
                      >
                        {classes.map((cls) => (
                          <MenuItem key={cls._id} value={cls._id}>
                            {cls.name} ({cls.subject})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      name="title"
                      label="Assignment Title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      name="description"
                      label="Description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Programming Language</InputLabel>
                      <Select
                        value={formData.language}
                        onChange={(e) => handleSelectChange('language', e.target.value)}
                        label="Programming Language"
                      >
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="cpp">C++</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Difficulty</InputLabel>
                      <Select
                        value={formData.difficulty}
                        onChange={(e) => handleSelectChange('difficulty', e.target.value)}
                        label="Difficulty"
                      >
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      name="totalPoints"
                      label="Total Points"
                      value={formData.totalPoints}
                      onChange={handleInputChange}
                      inputProps={{ min: 1, max: 1000 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      name="dueDate"
                      label="Due Date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Skills */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Skills & Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Add Skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button variant="outlined" onClick={addSkill}>
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => removeSkill(skill)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Starter Code */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Starter Code (Optional)
                </Typography>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Editor
                    height="300px"
                    language={formData.language}
                    value={formData.starterCode}
                    onChange={(value) => setFormData(prev => ({ ...prev, starterCode: value || '' }))}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Test Cases */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Test Cases (Optional)
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addTestCase}
                  >
                    Add Test Case
                  </Button>
                </Box>
                {testCases.map((testCase, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2">
                        Test Case {index + 1}
                      </Typography>
                      {testCases.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeTestCase(index)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Input"
                          value={testCase.input}
                          onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Expected Output"
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateAssignment;