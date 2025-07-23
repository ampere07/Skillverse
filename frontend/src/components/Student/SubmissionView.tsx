import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, AlertCircle, Code, Award } from 'lucide-react';
import api from '../../services/api';
import { Assignment, Submission } from '../../types';
import Card from '../Common/Card';
import Button from '../Common/Button';
import JavaEditor from './JavaEditor';

const SubmissionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchAssignmentAndSubmission();
    }
  }, [id]);

  const fetchAssignmentAndSubmission = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/assignments/${id}`);
      setAssignment(response.data.assignment);
      setSubmission(response.data.submission);
      setCode(response.data.submission?.code || response.data.assignment.starterCode);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post(`/api/submissions/assignments/${id}`, { code });
      await fetchAssignmentAndSubmission();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = () => {
    if (!assignment) return null;

    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = now > dueDate;

    if (submission) {
      if (submission.status === 'graded') {
        return {
          icon: Award,
          text: `Graded: ${submission.grade}/100`,
          color: 'text-success-600',
          bgColor: 'bg-success-50'
        };
      } else {
        return {
          icon: CheckCircle,
          text: 'Submitted',
          color: 'text-primary-600',
          bgColor: 'bg-primary-50'
        };
      }
    } else if (isOverdue) {
      return {
        icon: AlertCircle,
        text: 'Overdue',
        color: 'text-danger-600',
        bgColor: 'bg-danger-50'
      };
    } else {
      return {
        icon: Clock,
        text: 'Not Submitted',
        color: 'text-warning-600',
        bgColor: 'bg-warning-50'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-600">{error}</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Assignment not found</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const isOverdue = new Date() > new Date(assignment.dueDate);
  const canSubmit = !isOverdue || submission;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate('/assignments')}
          >
            Back to Assignments
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
        </div>
        
        {statusInfo && (
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
            <statusInfo.icon className={`w-4 h-4 ${statusInfo.color}`} />
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Description</h3>
                <p className="text-gray-600 mt-1">{assignment.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Due Date</h3>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{formatDate(assignment.dueDate)}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Points</h3>
                  <div className="flex items-center mt-1">
                    <Award className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{assignment.points} points</span>
                  </div>
                </div>
              </div>
              
              {assignment.testCases && assignment.testCases.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900">Test Cases</h3>
                  <div className="mt-2 space-y-2">
                    {assignment.testCases.filter(tc => !tc.hidden).map((testCase, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">Input:</span> {testCase.input || '<empty>'}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Expected Output:</span> {testCase.expectedOutput}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Info</h2>
            <div className="space-y-3">
              {submission ? (
                <>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Submitted:</span>
                    <p className="text-gray-900">{formatDate(submission.submittedAt)}</p>
                  </div>
                  {submission.status === 'graded' && (
                    <>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Grade:</span>
                        <p className="text-gray-900 font-bold">{submission.grade}/100</p>
                      </div>
                      {submission.feedback && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Feedback:</span>
                          <p className="text-gray-900 mt-1">{submission.feedback}</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <p className="text-gray-600">No submission yet</p>
              )}
            </div>
          </Card>

          {canSubmit && (
            <Card>
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={!code.trim() || submitting}
                  fullWidth
                  size="lg"
                >
                  {submission ? 'Resubmit Assignment' : 'Submit Assignment'}
                </Button>
                {error && (
                  <p className="text-danger-600 text-sm mt-2">{error}</p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <Card className="h-96">
        <JavaEditor
          initialCode={code}
          onCodeChange={setCode}
          showSaveButton={false}
          readOnly={false}
        />
      </Card>
    </div>
  );
};

export default SubmissionView;