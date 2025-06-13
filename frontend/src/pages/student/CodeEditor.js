import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  Save,
  Send,
  ArrowBack,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CodeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const response = await axios.get(`/api/student/assignments/${id}`, {
        withCredentials: true
      });
      
      setAssignment(response.data.assignment);
      setSubmission(response.data.submission);
      
      // Set initial code
      if (response.data.submission) {
        setCode(response.data.submission.code);
      } else {
        setCode(response.data.assignment.starterCode || getDefaultCode(response.data.assignment.language));
      }
    } catch (error) {
      console.error('Failed to fetch assignment:', error);
      setError('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCode = (language) => {
    const defaults = {
      javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
      python: '# Write your Python code here\nprint("Hello, World!")',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
    };
    return defaults[language] || '// Write your code here';
  };

  const handleRunCode = async () => {
    setRunning(true);
    setOutput('');
    setError('');

    try {
      // This would integrate with Judge0 API or similar
      // For now, we'll simulate code execution
      setOutput('Code execution simulation - this would run your code and show the output here.');
    } catch (error) {
      setError('Failed to run code');
    } finally {
      setRunning(false);
    }
  };

  const handleSaveCode = async () => {
    try {
      // Save code without submitting
      await axios.post(`/api/student/submit/${id}`, {
        code,
        language: assignment.language
      }, {
        withCredentials: true
      });
      
      // Show success message briefly
      setOutput('Code saved successfully!');
      setTimeout(() => setOutput(''), 2000);
    } catch (error) {
      setError('Failed to save code');
    }
  };

  const handleSubmitAssignment = async () => {
    setSubmitting(true);
    setError('');

    try {
      await axios.post(`/api/student/submit/${id}`, {
        code,
        language: assignment.language
      }, {
        withCredentials: true
      });
      
      setSubmitDialogOpen(false);
      navigate('/assignments');
    } catch (error) {
      setError('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = () => {
    return new Date(assignment?.dueDate) < new Date();
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!assignment) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Assignment not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/assignments')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {assignment.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Due: {formatDate(assignment.dueDate)}
              {isOverdue() && ' (Overdue)'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={assignment.language}
              size="small"
              color="primary"
            />
            <Chip
              label={`${assignment.totalPoints} points`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Toolbar>
      </AppBar>

      {error && (
        <Alert severity="error" sx={{ m: 1 }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Code Editor */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ m: 1, flexGrow: 1, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="500">
                Code Editor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {assignment.description}
              </Typography>
            </Box>
            
            <Box sx={{ height: 'calc(100% - 80px)' }}>
              <Editor
                height="100%"
                language={assignment.language === 'cpp' ? 'cpp' : assignment.language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* Output Panel */}
        <Box sx={{ width: 400, display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ m: 1, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="500">
                Output
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1, p: 2, fontFamily: 'monospace', fontSize: '0.875rem', overflow: 'auto' }}>
              {running ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinearProgress sx={{ flexGrow: 1, mr: 1 }} />
                  <Typography variant="caption">Running...</Typography>
                </Box>
              ) : (
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {output || 'Click "Run Code" to see output here'}
                </pre>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Bottom Action Bar */}
      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={handleRunCode}
            disabled={running}
          >
            Run Code
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={handleSaveCode}
          >
            Save
          </Button>
        </Box>

        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => setSubmitDialogOpen(true)}
          disabled={isOverdue() && !submission}
          color={isOverdue() ? 'error' : 'primary'}
        >
          {submission ? 'Resubmit' : 'Submit Assignment'}
        </Button>
      </Paper>

      {/* Submit Confirmation Dialog */}
      <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)}>
        <DialogTitle>Submit Assignment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit this assignment? 
            {submission && ' This will replace your previous submission.'}
          </Typography>
          {isOverdue() && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This assignment is overdue. Late submissions may receive reduced points.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitAssignment}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CodeEditor;