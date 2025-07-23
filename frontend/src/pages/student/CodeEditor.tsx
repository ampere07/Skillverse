import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  Grid,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import { PlayArrow, Save, Send, Info } from '@mui/icons-material';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  starterCode: string;
  language: string;
  difficulty: string;
  skills: string[];
  totalPoints: number;
  dueDate: string;
  classId: {
    name: string;
  };
  submission?: {
    code: string;
    grade?: number;
    teacherFeedback?: string;
    status: string;
  };
}

const CodeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchAssignment = useCallback(async () => {
    try {
      const response = await axios.get(`/api/student/assignments/${id}`);
      setAssignment(response.data);
      setCode(response.data.submission?.code || response.data.starterCode || '');
    } catch (error) {
      console.error('Error fetching assignment:', error);
      setError('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAssignment();
    }
  }, [id, fetchAssignment]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`/api/student/submit/${id}`, { code });
      setSuccess('Assignment submitted successfully!');
      fetchAssignment(); // Refresh to get updated submission status
    } catch (error) {
      console.error('Error submitting assignment:', error);
      const errorMessage = (error as any).response?.data?.message || 'Error submitting assignment';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRunCode = () => {
    setSuccess('Code execution is not available in this template version.');
  };

  const handleSaveCode = () => {
    setSuccess('Code saved locally (template mode).');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!assignment) {
    return (
      <Box>
        <Alert severity="error">Assignment not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {assignment.title}
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Template Mode Notice */}
      <Alert severity="info" sx={{ mb: 3 }} icon={<Info />}>
        <Typography variant="body2">
          <strong>Template Mode:</strong> This is a UI template for the code editor. 
          Code execution and compilation features are not implemented in this version.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Assignment Details */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignment Details
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Class: {assignment.classId.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Points: {assignment.totalPoints}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={assignment.difficulty}
                  color={getDifficultyColor(assignment.difficulty) as any}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={assignment.language.toUpperCase()}
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              {assignment.skills.length > 0 && (
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
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {assignment.description}
              </Typography>
              
              {assignment.submission && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Submission Status
                  </Typography>
                  <Chip
                    label={assignment.submission.status}
                    color={assignment.submission.status === 'graded' ? 'success' : 'warning'}
                    size="small"
                  />
                  {assignment.submission.grade && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Grade: {assignment.submission.grade}%
                    </Typography>
                  )}
                  {assignment.submission.teacherFeedback && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Teacher Feedback:
                      </Typography>
                      <Typography variant="body2">
                        {assignment.submission.teacherFeedback}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Template Features Info */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Template Features
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                This template includes:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2">Monaco Code Editor</Typography>
                <Typography component="li" variant="body2">Syntax Highlighting</Typography>
                <Typography component="li" variant="body2">Assignment Details Display</Typography>
                <Typography component="li" variant="body2">Submission Status Tracking</Typography>
                <Typography component="li" variant="body2">Responsive Design</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Code Editor */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Code Editor (Template)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<PlayArrow />}
                  size="small"
                  onClick={handleRunCode}
                  disabled
                >
                  Run Code
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Save />}
                  size="small"
                  onClick={handleSaveCode}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleSubmit}
                  disabled={submitting}
                  size="small"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Editor
                height="500px"
                language={assignment.language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'all',
                  selectOnLineNumbers: true,
                  matchBrackets: 'always',
                  autoClosingBrackets: 'always',
                  autoClosingQuotes: 'always',
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            </Box>

            {/* Template Output Console */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Output Console (Template)
              </Typography>
              <Paper 
                sx={{ 
                  p: 2, 
                  bgcolor: 'grey.900', 
                  color: 'grey.100',
                  fontFamily: 'monospace',
                  minHeight: 120,
                  maxHeight: 200,
                  overflow: 'auto'
                }}
              >
                <Typography variant="body2" sx={{ color: 'success.light' }}>
                  Welcome to SkillVerse Code Editor Template
                </Typography>
                <Typography variant="body2" sx={{ color: 'info.light' }}>
                  → This is a template version without code execution
                </Typography>
                <Typography variant="body2" sx={{ color: 'warning.light' }}>
                  → Click "Run Code" to see this message
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  → Ready for integration with code compilation services
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CodeEditor;