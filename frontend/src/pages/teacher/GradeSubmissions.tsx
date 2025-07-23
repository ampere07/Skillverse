import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
} from '@mui/material';
import { Person, Grade } from '@mui/icons-material';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

interface AssignmentType {
  _id: string;
  title: string;
  classId: {
    _id: string;
    name: string;
  };
}

interface Submission {
  _id: string;
  assignmentId: AssignmentType;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  code: string;
  language: string;
  grade?: number;
  teacherFeedback?: string;
  submittedAt: string;
  status: string;
}

const GradeSubmissions: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSubmissions = useCallback(async () => {
    if (!selectedAssignment) return;
    
    try {
      const response = await axios.get(`/api/teacher/submissions/${selectedAssignment}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  }, [selectedAssignment]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions();
    }
  }, [selectedAssignment, fetchSubmissions]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('/api/teacher/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleGradeSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.teacherFeedback || '');
    setGradeDialogOpen(true);
  };

  const submitGrade = async () => {
    if (!selectedSubmission) return;

    const gradeValue = parseInt(grade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      setError('Please enter a valid grade between 0 and 100');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`/api/teacher/grade/${selectedSubmission._id}`, {
        grade: gradeValue,
        feedback
      });

      setSuccess('Submission graded successfully!');
      setGradeDialogOpen(false);
      fetchSubmissions(); // Refresh submissions
    } catch (error) {
      console.error('Error grading submission:', error);
      const errorMessage = (error as any).response?.data?.message || 'Error grading submission. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Grade Submissions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Review and grade student submissions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Assignment Selection */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Assignment
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Assignment</InputLabel>
                <Select
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  label="Assignment"
                >
                  {assignments.map((assignment) => (
                    <MenuItem key={assignment._id} value={assignment._id}>
                      {assignment.title} - {assignment.classId.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Submissions List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Submissions
              </Typography>
              {submissions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {selectedAssignment ? 'No submissions found for this assignment.' : 'Please select an assignment to view submissions.'}
                </Typography>
              ) : (
                <List>
                  {submissions.map((submission) => (
                    <ListItem
                      key={submission._id}
                      divider
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={submission.status}
                            color={getStatusColor(submission.status) as any}
                            size="small"
                          />
                          {submission.grade && (
                            <Chip
                              label={`${submission.grade}%`}
                              color={submission.grade >= 90 ? 'success' : submission.grade >= 70 ? 'warning' : 'error'}
                              size="small"
                            />
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Grade />}
                            onClick={() => handleGradeSubmission(submission)}
                          >
                            {submission.status === 'graded' ? 'Update Grade' : 'Grade'}
                          </Button>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={submission.studentId.name}
                        secondary={`Submitted: ${new Date(submission.submittedAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grading Dialog */}
      <Dialog
        open={gradeDialogOpen}
        onClose={() => setGradeDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Grade Submission - {selectedSubmission?.studentId.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Code Display */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Student Code
              </Typography>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Editor
                  height="400px"
                  language={selectedSubmission?.language || 'javascript'}
                  value={selectedSubmission?.code || ''}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on'
                  }}
                />
              </Box>
            </Grid>

            {/* Grading Panel */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Grading
              </Typography>
              <TextField
                fullWidth
                type="number"
                label="Grade (0-100)"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                inputProps={{ min: 0, max: 100 }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the student..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={submitGrade}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Grade'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GradeSubmissions;