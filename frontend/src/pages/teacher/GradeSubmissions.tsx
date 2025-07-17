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
  Paper,
  Chip,
  Divider,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { CheckCircle, Schedule } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import axios from 'axios';

interface Class {
  _id: string;
  name: string;
  subject: string;
}

interface AssignmentData {
  _id: string;
  title: string;
  classId: string;
}

interface Submission {
  _id: string;
  assignmentId: {
    _id: string;
    title: string;
    totalPoints: number;
  };
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  code: string;
  language: string;
  grade?: number;
  teacherFeedback?: string;
  status: 'pending' | 'graded';
  submittedAt: string;
}

const GradeSubmissions: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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

  const fetchAssignments = useCallback(async () => {
    if (!selectedClass) return;
    
    try {
      const response = await axios.get('/api/teacher/assignments');
      const filteredAssignments = response.data.filter(
        (assignment: AssignmentData) => assignment.classId === selectedClass
      );
      setAssignments(filteredAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  }, [selectedClass]);

  const fetchSubmissions = useCallback(async () => {
    if (!selectedAssignment) return;
    
    try {
      const response = await axios.get(`/api/teacher/submissions/${selectedAssignment}`);
      setSubmissions(response.data);
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  }, [selectedAssignment]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleClassChange = (e: SelectChangeEvent) => {
    setSelectedClass(e.target.value);
    setSelectedAssignment('');
    setSubmissions([]);
    setSelectedSubmission(null);
  };

  const handleAssignmentChange = (e: SelectChangeEvent) => {
    setSelectedAssignment(e.target.value);
    setSelectedSubmission(null);
  };

  const handleSubmissionSelect = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.teacherFeedback || '');
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !grade) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`/api/teacher/grade/${selectedSubmission._id}`, {
        grade: parseInt(grade),
        feedback
      });
      setSuccess('Submission graded successfully!');
      fetchSubmissions(); // Refresh submissions
      
      // Update the selected submission
      setSelectedSubmission({
        ...selectedSubmission,
        grade: parseInt(grade),
        teacherFeedback: feedback,
        status: 'graded'
      });
    } catch (error) {
      setError('Error grading submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'graded' ? 'success' : 'warning';
  };

  const getStatusIcon = (status: string) => {
    return status === 'graded' ? <CheckCircle /> : <Schedule />;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Grade Submissions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Review and grade student submissions
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Selection Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Assignment
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  onChange={handleClassChange}
                  label="Class"
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.name} ({cls.subject})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Assignment</InputLabel>
                <Select
                  value={selectedAssignment}
                  onChange={handleAssignmentChange}
                  label="Assignment"
                  disabled={!selectedClass}
                >
                  {assignments.map((assignment) => (
                    <MenuItem key={assignment._id} value={assignment._id}>
                      {assignment.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Submissions List */}
              {submissions.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Submissions ({submissions.length})
                  </Typography>
                  <List>
                    {submissions.map((submission) => (
                      <ListItem
                        key={submission._id}
                        button
                        onClick={() => handleSubmissionSelect(submission)}
                        selected={selectedSubmission?._id === submission._id}
                        divider
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {getStatusIcon(submission.status)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={submission.studentId.name}
                          secondary={`Submitted: ${new Date(submission.submittedAt).toLocaleDateString()}`}
                        />
                        <Chip
                          label={submission.status}
                          color={getStatusColor(submission.status) as any}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Grading Interface */}
        <Grid item xs={12} md={8}>
          {selectedSubmission ? (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {selectedSubmission.studentId.name}'s Submission
                  </Typography>
                  <Chip
                    label={selectedSubmission.status}
                    color={getStatusColor(selectedSubmission.status) as any}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Assignment: {selectedSubmission.assignmentId.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Code Display */}
                <Typography variant="subtitle1" gutterBottom>
                  Student Code
                </Typography>
                <Box sx={{ height: 300, border: 1, borderColor: 'divider', mb: 2 }}>
                  <Editor
                    height="100%"
                    language={selectedSubmission.language}
                    value={selectedSubmission.code}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      readOnly: true
                    }}
                  />
                </Box>

                {/* Grading Section */}
                <Typography variant="subtitle1" gutterBottom>
                  Grading
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Grade"
                      type="number"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      inputProps={{ min: 0, max: selectedSubmission.assignmentId.totalPoints }}
                      helperText={`Out of ${selectedSubmission.assignmentId.totalPoints} points`}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Feedback"
                      multiline
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide feedback to help the student improve..."
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleGradeSubmission}
                    disabled={loading || !grade}
                  >
                    {loading ? 'Grading...' : 'Save Grade'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Select a submission to grade
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Choose a class and assignment from the left panel to view submissions
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GradeSubmissions;