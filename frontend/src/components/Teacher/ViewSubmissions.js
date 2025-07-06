import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submissionAPI, assignmentAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function ViewSubmissions() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' });
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadData();
  }, [assignmentId]);

  const loadData = async () => {
    try {
      const [assignmentResponse, submissionsResponse] = await Promise.all([
        assignmentAPI.getById(assignmentId),
        submissionAPI.getByAssignmentId(assignmentId),
      ]);
      
      setAssignment(assignmentResponse.data.assignment);
      setSubmissions(submissionsResponse.data.submissions);
    } catch (error) {
      showError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      grade: submission.grade || '',
      feedback: submission.feedback || '',
    });
  };

  const handleGradeChange = (e) => {
    setGradeForm({
      ...gradeForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    
    if (!gradeForm.grade || gradeForm.grade < 0 || gradeForm.grade > assignment.totalPoints) {
      showError(`Grade must be between 0 and ${assignment.totalPoints}`);
      return;
    }

    setGrading(true);

    try {
      await submissionAPI.grade(
        selectedSubmission._id,
        parseInt(gradeForm.grade),
        gradeForm.feedback
      );
      
      showSuccess('Submission graded successfully!');
      
      // Update the submission in the list
      setSubmissions(prev => prev.map(sub => 
        sub._id === selectedSubmission._id 
          ? { ...sub, grade: parseInt(gradeForm.grade), feedback: gradeForm.feedback, status: 'graded' }
          : sub
      ));
      
      // Update selected submission
      setSelectedSubmission(prev => ({
        ...prev,
        grade: parseInt(gradeForm.grade),
        feedback: gradeForm.feedback,
        status: 'graded'
      }));
      
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const getStatusBadge = (submission) => {
    if (submission.status === 'graded') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Graded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Assignment not found.</p>
        <Link to="/teacher/dashboard" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
          <p className="text-gray-600 mt-2">View and grade student submissions</p>
          <div className="flex items-center mt-4 space-x-4">
            <span className="text-sm text-gray-500">
              Language: {assignment.language}
            </span>
            <span className="text-sm text-gray-500">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </span>
            <span className="text-sm text-gray-500">
              Total Points: {assignment.totalPoints}
            </span>
          </div>
        </div>
        <Link to="/teacher/dashboard" className="btn btn-outline">
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions List */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              Submissions ({submissions.length})
            </h2>
          </div>
          <div className="card-body">
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedSubmission?._id === submission._id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleViewSubmission(submission)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {submission.studentId?.name || 'Unknown Student'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {submission.studentId?.email || 'No email'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(submission)}
                        {submission.grade !== null && (
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            {submission.grade}/{assignment.totalPoints}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submission Details */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedSubmission ? 'Submission Details' : 'Select a Submission'}
            </h2>
          </div>
          <div className="card-body">
            {!selectedSubmission ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Select a submission from the list to view details and grade it.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Student Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Student Information</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {selectedSubmission.studentId?.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {selectedSubmission.studentId?.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Submitted:</span> {new Date(selectedSubmission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Code */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Submitted Code</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>{selectedSubmission.code}</code>
                    </pre>
                  </div>
                </div>

                {/* Grading Form */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Grade Submission</h3>
                  <form onSubmit={handleGradeSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="grade" className="form-label">
                        Grade (0 - {assignment.totalPoints})
                      </label>
                      <input
                        type="number"
                        id="grade"
                        name="grade"
                        min="0"
                        max={assignment.totalPoints}
                        required
                        className="form-control"
                        value={gradeForm.grade}
                        onChange={handleGradeChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="feedback" className="form-label">
                        Feedback (Optional)
                      </label>
                      <textarea
                        id="feedback"
                        name="feedback"
                        rows={4}
                        className="form-control"
                        placeholder="Provide feedback to the student..."
                        value={gradeForm.feedback}
                        onChange={handleGradeChange}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={grading}
                      className="btn btn-primary w-full"
                    >
                      {grading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Saving Grade...
                        </>
                      ) : (
                        'Save Grade'
                      )}
                    </button>
                  </form>
                </div>

                {/* Current Grade */}
                {selectedSubmission.status === 'graded' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Current Grade</h4>
                    <p className="text-green-700">
                      <span className="font-semibold">
                        {selectedSubmission.grade}/{assignment.totalPoints}
                      </span>
                      {selectedSubmission.feedback && (
                        <>
                          <br />
                          <span className="text-sm mt-1 block">
                            Feedback: {selectedSubmission.feedback}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSubmissions;