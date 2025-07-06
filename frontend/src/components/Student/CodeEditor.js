import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentAPI, submissionAPI, compilerAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function CodeEditor() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [testing, setTesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadAssignment();
  }, [assignmentId]);

  const loadAssignment = async () => {
    try {
      const assignmentResponse = await assignmentAPI.getById(assignmentId);
      setAssignment(assignmentResponse.data.assignment);
      
      // Try to load existing submission
      try {
        const submissionResponse = await submissionAPI.getMySubmission(assignmentId);
        setSubmission(submissionResponse.data.submission);
        setCode(submissionResponse.data.submission.code);
      } catch (error) {
        // No existing submission, use starter code
        setCode(assignmentResponse.data.assignment.starterCode || '');
      }
    } catch (error) {
      showError('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      showError('Please write some code first');
      return;
    }

    setRunning(true);
    setOutput('');

    try {
      const response = await compilerAPI.compile(code, assignment.language);
      setOutput(response.data.output || 'No output');
    } catch (error) {
      setOutput(error.response?.data?.error || 'Compilation failed');
    } finally {
      setRunning(false);
    }
  };

  const handleTestCode = async () => {
    if (!code.trim()) {
      showError('Please write some code first');
      return;
    }

    if (!assignment.testCases || assignment.testCases.length === 0) {
      showError('No test cases available for this assignment');
      return;
    }

    setTesting(true);
    setTestResults(null);

    try {
      const response = await compilerAPI.test(code, assignment.language, assignment.testCases);
      setTestResults(response.data);
    } catch (error) {
      showError('Failed to run tests');
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      showError('Please write some code before submitting');
      return;
    }

    setSubmitting(true);

    try {
      const response = await submissionAPI.create(assignmentId, code);
      setSubmission(response.data.submission);
      showSuccess('Solution submitted successfully!');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit solution');
    } finally {
      setSubmitting(false);
    }
  };

  const getLanguageMode = (language) => {
    const modes = {
      python: 'python',
      javascript: 'javascript',
      java: 'java',
      cpp: 'cpp',
    };
    return modes[language] || 'text';
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
        <Link to="/student/assignments" className="btn btn-primary mt-4">
          Back to Assignments
        </Link>
      </div>
    );
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();
  const canSubmit = !isOverdue || submission;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <span className="text-sm text-gray-500">
              Language: {assignment.language}
            </span>
            <span className="text-sm text-gray-500">
              Points: {assignment.totalPoints}
            </span>
            <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              Due: {new Date(assignment.dueDate).toLocaleString()}
            </span>
          </div>
          {isOverdue && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Assignment Overdue
              </span>
            </div>
          )}
        </div>
        <Link to="/student/assignments" className="btn btn-outline">
          Back to Assignments
        </Link>
      </div>

      {/* Submission Status */}
      {submission && (
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">Submission Status</h3>
                <p className="text-sm text-gray-600">
                  Submitted on {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                {submission.status === 'graded' ? (
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Graded
                    </span>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {submission.grade}/{assignment.totalPoints}
                    </div>
                    {submission.feedback && (
                      <div className="text-sm text-gray-600 mt-1">
                        Feedback: {submission.feedback}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Review
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Problem Description</h2>
          </div>
          <div className="card-body">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{assignment.description}</div>
            </div>
            
            {assignment.testCases && assignment.testCases.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Test Cases</h3>
                <div className="space-y-3">
                  {assignment.testCases.map((testCase, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm">
                        <div className="mb-2">
                          <span className="font-medium">Input:</span>
                          <pre className="mt-1 text-xs bg-white p-2 rounded border">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium">Expected Output:</span>
                          <pre className="mt-1 text-xs bg-white p-2 rounded border">
                            {testCase.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Code Editor</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="btn btn-sm btn-secondary"
                >
                  {running ? (
                    <>
                      <div className="loading-spinner"></div>
                      Running...
                    </>
                  ) : (
                    'Run Code'
                  )}
                </button>
                <button
                  onClick={handleTestCode}
                  disabled={testing}
                  className="btn btn-sm btn-outline"
                >
                  {testing ? (
                    <>
                      <div className="loading-spinner"></div>
                      Testing...
                    </>
                  ) : (
                    'Test Code'
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm border-none resize-none focus:outline-none"
              placeholder={`Write your ${assignment.language} code here...`}
              style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
            />
          </div>
        </div>
      </div>

      {/* Output Section */}
      {(output || testResults) && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              {testResults ? 'Test Results' : 'Output'}
            </h2>
          </div>
          <div className="card-body">
            {testResults ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">Test Summary</h3>
                  <div className="text-sm">
                    <span className={`font-semibold ${
                      testResults.summary.passed === testResults.summary.total 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {testResults.summary.passed}/{testResults.summary.total} tests passed
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({testResults.summary.percentage}%)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {testResults.results.map((result, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 ${
                        result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">Test Case {index + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.passed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="font-medium">Input:</span>
                          <pre className="mt-1 bg-white p-2 rounded border">
                            {result.input}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium">Expected:</span>
                          <pre className="mt-1 bg-white p-2 rounded border">
                            {result.expectedOutput}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium">Actual:</span>
                          <pre className={`mt-1 p-2 rounded border ${
                            result.passed ? 'bg-white' : 'bg-red-50 border-red-200'
                          }`}>
                            {result.actualOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {output}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        {canSubmit ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || !code.trim()}
            className="btn btn-primary"
          >
            {submitting ? (
              <>
                <div className="loading-spinner"></div>
                Submitting...
              </>
            ) : submission ? (
              'Update Submission'
            ) : (
              'Submit Solution'
            )}
          </button>
        ) : (
          <div className="text-center">
            <p className="text-red-600 text-sm mb-2">
              This assignment is overdue and cannot be submitted.
            </p>
            <button disabled className="btn btn-primary opacity-50 cursor-not-allowed">
              Submit Solution
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeEditor;