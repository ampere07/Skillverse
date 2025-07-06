import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classAPI, assignmentAPI, submissionAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function StudentDashboard() {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const classesResponse = await classAPI.getAll();
      setClasses(classesResponse.data.classes);
      
      // Load assignments and submissions for all classes
      const allAssignments = [];
      const allSubmissions = [];
      
      for (const classItem of classesResponse.data.classes) {
        try {
          const assignmentsResponse = await assignmentAPI.getByClassId(classItem._id);
          allAssignments.push(...assignmentsResponse.data.assignments);
          
          // Get submissions for each assignment
          for (const assignment of assignmentsResponse.data.assignments) {
            try {
              const submissionResponse = await submissionAPI.getMySubmission(assignment._id);
              allSubmissions.push(submissionResponse.data.submission);
            } catch (error) {
              // No submission found for this assignment
            }
          }
        } catch (error) {
          console.error(`Error loading assignments for class ${classItem._id}:`, error);
        }
      }
      
      setAssignments(allAssignments);
      setSubmissions(allSubmissions);
    } catch (error) {
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentStatus = (assignment) => {
    const submission = submissions.find(s => s.assignmentId === assignment._id);
    if (!submission) return 'Not Started';
    if (submission.status === 'graded') return 'Graded';
    return 'Submitted';
  };

  const getAssignmentScore = (assignment) => {
    const submission = submissions.find(s => s.assignmentId === assignment._id);
    if (submission && submission.grade !== null) {
      return `${submission.grade}/${assignment.totalPoints}`;
    }
    return '-';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <div className="flex space-x-4">
          <Link to="/student/join-class" className="btn btn-primary">
            Join Class
          </Link>
          <Link to="/student/assignments" className="btn btn-secondary">
            View All Assignments
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Classes</p>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏫</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Classes */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Your Classes</h2>
        </div>
        <div className="card-body">
          {classes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No classes joined yet.</p>
              <Link to="/student/join-class" className="btn btn-primary mt-4">
                Join Your First Class
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {classes.map((classItem) => (
                <div key={classItem._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{classItem.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{classItem.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-500">
                          Teacher: {classItem.teacherId?.name || 'Unknown'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {classItem.students?.length || 0} students
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
        </div>
        <div className="card-body">
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No assignments available yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.slice(0, 5).map((assignment) => (
                <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{assignment.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-500">
                          Language: {assignment.language}
                        </span>
                        <span className="text-sm text-gray-500">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          Points: {assignment.totalPoints}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {getAssignmentStatus(assignment)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Score: {getAssignmentScore(assignment)}
                        </div>
                      </div>
                      <Link
                        to={`/student/assignment/${assignment._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        {getAssignmentStatus(assignment) === 'Not Started' ? 'Start' : 'View'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;