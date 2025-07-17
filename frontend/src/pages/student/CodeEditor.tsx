import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';
import { PlayArrow, Save, Send, CheckCircle, Error } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import axios from 'axios';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  difficulty: string;
  skills: string[];
  totalPoints: number;
  starterCode: string;
  language: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }>;
  classId: {
    name: string;
  };
  submission?: {
    code: string;
    grade: number;
    teacherFeedback: string;
    status: string;
  };
}

const CodeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; input: string; expected: string; actual: string }>>([]);

  const fetchAssignment = useCallback(async () => {
    if (!id) return;
    
    try {
      const response = await axios.get(`/api/student/assignments/${id}`);
      const assignmentData = response.data;
      setAssignment(assignmentData);
      setCode(assignmentData.submission?.code || assignmentData.starterCode || '');
    } catch (error) {
      console.error('Error fetching assignment:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const handleRunCode = async () => {
    setRunning(true);
    setOutput('');
    setTestResults([]);

    try {
      // Simulate code execution - in real implementation, this would call Judge0 API
      const simulatedOutput = `Output:\nHello, World!\n\nTest Results:\n✓ Test case 1 passed\n✓ Test case 2 passed\n✗ Test case 3 failed\n\nExecution completed.`;
      
      setTimeout(() => {
        setOutput(simulatedOutput);
        
        // Simulate test results
        const results = [
          { passed: true, input: "input1", expected: "expected1", actual: "expected1" },
          { passed: true, input: "input2", expected: "expected2", actual: "expected2" },
          { passed: false, input: "input3", expected: "expected3", actual: "actual3" },
        ];
        setTestResults(results);
        setRunning(false);
      }, 2000);
    } catch (error) {
      setOutput('Error running code: ' + error);
      setRunning(false);
    }
  };

  const handleSaveCode = async () => {
    if (!id) return;
    
    try {
      // Save code without submitting
      await axios.post(`/api/student/submit/${id}`, { code });
      // Show success message
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    
    setSubmitting(true);
    try {
      await axios.post(`/api/student/submit/${id}`, { code });
      // Show success message and possibly redirect
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Error submitting assignment');
    } finally {
      setSubmitting(false);
    }
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

  if (!assignment) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Assignment not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              {assignment.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {assignment.classId.name} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <Chip
              label={assignment.difficulty}
              color={
                assignment.difficulty === 'beginner' ? 'success' :
                assignment.difficulty === 'intermediate' ? 'warning' : 'error'
              }
              sx={{ mr: 1 }}
            />
            <Chip label={`${assignment.totalPoints} pts`} variant="outlined" />
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        {/* Problem Description */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Problem Description
            </Typography>
            <Typography variant="body2" paragraph>
              {assignment.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ mb: 2 }}>
              {assignment.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            {/* Test Cases */}
            <Typography variant="h6" gutterBottom>
              Test Cases
            </Typography>
            {assignment.testCases.filter(tc => !tc.isHidden).map((testCase, index) => (
              <Card key={index} sx={{ mb: 1 }}>
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Input:</strong> {testCase.input}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Expected Output:</strong> {testCase.expectedOutput}
                  </Typography>
                </CardContent>
              </Card>
            ))}

            {/* Previous Submission */}
            {assignment.submission && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Previous Submission
                </Typography>
                {assignment.submission.grade && (
                  <Chip
                    label={`Grade: ${assignment.submission.grade}%`}
                    color={assignment.submission.grade >= 90 ? 'success' : assignment.submission.grade >= 70 ? 'warning' : 'error'}
                    sx={{ mb: 1 }}
                  />
                )}
                {assignment.submission.teacherFeedback && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      <strong>Teacher Feedback:</strong> {assignment.submission.teacherFeedback}
                    </Typography>
                  </Alert>
                )}
              </>
            )}
          </Paper>
        </Grid>

        {/* Code Editor */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Code Editor ({assignment.language})</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Editor
                height="100%"
                language={assignment.language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Output */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Output</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
              {output ? (
                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                  {output}
                </pre>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Run your code to see output here
                </Typography>
              )}
              
              {/* Test Results */}
              {testResults.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Test Results:
                  </Typography>
                  {testResults.map((result, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Chip
                        icon={result.passed ? <CheckCircle /> : <Error />}
                        label={`Test ${index + 1} ${result.passed ? 'Passed' : 'Failed'}`}
                        color={result.passed ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Actions */}
      <Paper sx={{ p: 2, mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={handleRunCode}
            disabled={running}
          >
            {running ? 'Running...' : 'Run'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={handleSaveCode}
          >
            Save
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CodeEditor;