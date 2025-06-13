import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  NavigateNext,
  NavigateBefore,
  PlayArrow,
  Save,
  Code,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import axios from 'axios';

const GradeSubmissions = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  useEffect(() => {
    // Load current submission data
    if (submissions.length > 0 && currentSubmissionIndex < submissions.length) {
      const currentSubmission = submissions[currentSubmissionIndex];
      setGrade(currentSubmission.grade || '');
      setFeedback(currentSubmission.teacherFeedback || '');
      setOutput('');
    }
  }, [currentSubmissionIndex, submissions]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`/api/teacher/submissions/${assignmentId}`, {
        withCredentials: true
      });
      setAssignment(response.data.assignment);
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    setOutput('');

    try {
      // This would integrate with Judge0 API or similar
      // For now, we'll simulate code execution
      const currentSubmission = submissions[currentSubmissionIndex];
      setOutput(`Running ${currentSubmission.language} code...\n\nCode execution simulation - this would run the student's code and show the output here.`);
    } catch (error) {
      setOutput('Error running code: ' + error.message);
    } finally {
      setRunning(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!grade || grade < 0 || grade > 100) {
      alert('Please enter a valid grade between 0 and 100');
      return;
    }

    setGrading(true);

    try {
      const currentSubmission = submissions[currentSubmissionIndex];
      await axios.post(`/api/teacher/grade/${currentSubmission._id}`, {
        grade: parseInt(grade),
        feedback
      }, {
        withCredentials: true
      });

      // Update the submission in the local state
      const updatedSubmissions = [...submissions];
      updatedSubmissions[currentSubmissionIndex] = {
        ...updatedSubmissions[currentSubmissionIndex],
        grade: parseInt(grade),
        teacherFeedback: feedback,
        status: 'graded'
      };
      setSubmissions(updatedSubmissions);

      // Move to next ungraded submission
      const nextUngraded = updatedSubmissions.findIndex((sub, index) => 
        index > currentSubmissionIndex && sub.status === 'pending'
      );
      
      if (nextUngraded !== -1) {
        setCurrentSubmissionIndex(nextUngraded);
      }

    } catch (error) {
      console.error('Failed to grade submission:', error);
      alert('Failed to save grade');
    } finally {
      setGrading(false);
    }
  };

  const navigateSubmission = (direction) => {
    if (direction === 'next' && currentSubmissionIndex < submissions.length - 1) {
      setCurrentSubmissionIndex(currentSubmissionIndex + 1);
    } else if (direction === 'prev' && currentSubmissionIndex > 0) {
      setCurrentSubmissionIndex(currentSubmissionIndex - 1);
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

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'info';
    if (grade >= 70) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="Grade Submissions"
          subtitle="Review and grade student code submissions"
        />
        <LinearProgress />
      </Box>
    );
  }

  if (!assignment) {
    return (
      <Box>
        <PageHeader
          title="Grade Submissions"
          subtitle="Review and grade student code submissions"
        />
        <Card>
          <Typography>Please select an assignment to grade submissions.</Typography>
        </Card>
      </Box>
    );
  }

  if (submissions.length === 0) {
    return (
      <Box>
        <PageHeader
          title="Grade Submissions"
          subtitle={`${assignment.title} - No submissions yet`}
        />
        <Card>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Code sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Submissions Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Students haven't submitted any code for this assignment yet.
            </Typography>
          </Box>
        </Card>
      </Box>
    );
  }

  const currentSubmission = submissions[currentSubmissionIndex];

  return (
    <Box>
      <PageHeader
        title="Grade Submissions"
        subtitle={`${assignment.title} - ${submissions.length} submissions`}
      />

      {/* Navigation Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<NavigateBefore />}
              onClick={() => navigateSubmission('prev')}
              disabled={currentSubmissionIndex === 0}
            >
              Previous
            </Button>
            
            <Typography variant="h6">
              {currentSubmissionIndex + 1} of {submissions.length}
            </Typography>
            
            <Button
              endIcon={<NavigateNext />}
              onClick={() => navigateSubmission('next')}
              disabled={currentSubmissionIndex === submissions.length - 1}
            >
              Next
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Student: {currentSubmission.studentId?.name}
            </Typography>
            <Chip
              label={currentSubmission.status}
              color={currentSubmission.status === 'graded' ? 'success' : 'warning'}
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Code Viewer */}
        <Grid item xs={12} md={8}>
          <Card
            title="Student Code"
            subtitle={`Submitted ${formatDate(currentSubmission.submittedAt)}`}
          >
            <Box sx={{ mb: 2 }}>
              <Chip
                label={currentSubmission.language}
                size="small"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                onClick={handleRunCode}
                disabled={running}
                size="small"
              >
                {running ? 'Running...' : 'Run Code'}
              </Button>
            </Box>

            <Box sx={{ height: 400, border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
              <Editor
                height="100%"
                language={currentSubmission.language === 'cpp' ? 'cpp' : currentSubmission.language}
                value={currentSubmission.code}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                }}
              />
            </Box>

            {/* Output */}
            {output && (
              <Paper sx={{ p: 2, backgroundColor: 'grey.900', color: 'grey.100' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Output:
                </Typography>
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {output}
                </pre>
              </Paper>
            )}
          </Card>
        </Grid>

        {/* Grading Panel */}
        <Grid item xs={12} md={4}>
          <Card title="Grade Submission">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Grade (0-100)"
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                inputProps={{ min: 0, max: 100 }}
                fullWidth
              />

              <TextField
                label="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                multiline
                rows={6}
                fullWidth
                placeholder="Provide constructive feedback to help the student improve..."
              />

              {currentSubmission.status === 'graded' && (
                <Box sx={{ p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.contrastText">
                    Already graded: {currentSubmission.grade}%
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleGradeSubmission}
                disabled={grading || !grade}
                fullWidth
              >
                {grading ? 'Saving...' : 'Save Grade'}
              </Button>
            </Box>
          </Card>

          {/* Assignment Info */}
          <Card title="Assignment Details" sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Total Points:</strong> {assignment.totalPoints}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Due Date:</strong> {formatDate(assignment.dueDate)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Language:</strong> {assignment.language}
            </Typography>
            <Typography variant="body2">
              <strong>Difficulty:</strong> {assignment.difficulty}
            </Typography>
          </Card>

          {/* Submission Overview */}
          <Card title="All Submissions" sx={{ mt: 2 }}>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {submissions.map((submission, index) => (
                <Paper
                  key={submission._id}
                  sx={{
                    p: 1,
                    mb: 1,
                    cursor: 'pointer',
                    backgroundColor: index === currentSubmissionIndex ? 'action.selected' : 'background.paper',
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                  onClick={() => setCurrentSubmissionIndex(index)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      {submission.studentId?.name}
                    </Typography>
                    {submission.status === 'graded' ? (
                      <Chip
                        label={`${submission.grade}%`}
                        size="small"
                        color={getGradeColor(submission.grade)}
                      />
                    ) : (
                      <Chip
                        label="Pending"
                        size="small"
                        color="warning"
                      />
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GradeSubmissions;