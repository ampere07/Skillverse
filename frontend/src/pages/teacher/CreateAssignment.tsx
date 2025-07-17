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
  Paper,
  IconButton,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { Add, Delete, Preview } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import axios from 'axios';

interface Class {
  _id: string;
  name: string;
  code: string;
  subject: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

const CreateAssignment: React.FC = () => {
  const [formData, setFormData] = useState({
    classId: '',
    title: '',
    description: '',
    starterCode: '',
    language: 'javascript',
    difficulty: 'beginner',
    skills: [] as string[],
    dueDate: new Date(),
    totalPoints: 100,
  });
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', expectedOutput: '', isHidden: false }
  ]);
  const [classes, setClasses] = useState<Class[]>([]); // Added missing state
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalPoints' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleTestCaseChange = (index: number, field: keyof TestCase, value: string | boolean) => {
    const newTestCases = [...testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!formData.classId || !formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    const validTestCases = testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim());
    if (validTestCases.length === 0) {
      setError('Please add at least one valid test case');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/teacher/assignments', {
        ...formData,
        testCases: validTestCases
      });
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
        dueDate: new Date(),
        totalPoints: 100,
      });
      setTestCases([{ input: '', expectedOutput: '', isHidden: false }]);
    } catch (error) {
      setError('Error creating assignment. Please try again.');
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
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Assignment Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assignment Details
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Class</InputLabel>
                  <Select
                    name="classId"
                    value={formData.classId}
                    onChange={handleSelectChange}
                    label="Class"
                  >
                    {classes.map((cls: Class) => (
                      <MenuItem key={cls._id} value={cls._id}>
                        {cls.name} ({cls.subject})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Assignment Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        name="language"
                        value={formData.language}
                        onChange={handleSelectChange}
                        label="Language"
                      >
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="cpp">C++</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Difficulty</InputLabel>
                      <Select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleSelectChange}
                        label="Difficulty"
                      >
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Total Points"
                  name="totalPoints"
                  type="number"
                  value={formData.totalPoints}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  type="datetime-local"
                  value={formData.dueDate.toISOString().slice(0, 16)}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: new Date(e.target.value) }))}
                  sx={{ mt: 2 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                {/* Skills */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      label="Add skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
                    />
                    <Button variant="outlined" onClick={handleSkillAdd}>
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleSkillRemove(skill)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Starter Code */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Starter Code (Optional)
                </Typography>
                <Box sx={{ height: 300, border: 1, borderColor: 'divider' }}>
                  <Editor
                    height="100%"
                    language={formData.language}
                    value={formData.starterCode}
                    onChange={(value) => setFormData(prev => ({ ...prev, starterCode: value || '' }))}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
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
                    Test Cases
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
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        Test Case {index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => removeTestCase(index)}
                        disabled={testCases.length === 1}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Input"
                          value={testCase.input}
                          onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                          multiline
                          rows={2}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Expected Output"
                          value={testCase.expectedOutput}
                          onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Preview />}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
  );
};

export default CreateAssignment;