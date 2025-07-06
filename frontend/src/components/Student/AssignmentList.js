import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classAPI, assignmentAPI, submissionAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function AssignmentList() {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const classesResponse = await classAPI.getAll();
      setClasses(classesResponse.data.classes);
      
      // Load assignments and submissions for all classes
      const allAssignments = [];
      const allSubmissions = [];
      
      for (const classItem of classesResponse.data.classes) {
        try {
          const assignmentsResponse = await assignmentAPI.getByClassId(classItem._id);
          const classAssignments = assignmentsResponse.data.assignments.map(assignment => ({
            ...assignment,
            className: classItem.name,
          }));
          allAssignments.push(...classAssignments);
          
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
      showError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentStatus = (assignment) => {
    const submission = submissions.find(s => s.assignmentId === assignment._id);
    if (!submission) return 'not-started';
    if (submission.status === 'graded') return 'graded';
    return 'submitted';
  };

  const getAssignmentScore = (assignment) => {
    const submission = submissions.find(s => s.assignmentId === assignment._id);
    if (submission && submission.grade !== null) {
      return `${submission.grade}/${assignment.totalPoints}`;
    }
    return null;
  };

  const getStatusBadge = (status) => {
    const badges = {
      'not-started': (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Not Started
        </span>
      ),
      'submitted': (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Submitted
        </span>
      ),
      'graded': (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Graded
        </span>
      ),
    };
    return badges[status];
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const filteredAssignments = assignments.filter(assignment => {
    const classMatch = selectedClass === 'all' || assignment.classId === selectedClass;
    const statusMatch = statusFilter === 'all' || getAssignmentStatus(assignment) === statusFilter;
    return classMatch && statusMatch;
  });

  const sortedAssignments = filteredAssignments.sort((a, b) => {
    // Sort by due date, with overdue assignments first
    const aOverdue = isOverdue(a.dueDate);
    const bOverdue = isOverdue(b.dueDate);
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <Link to="/student/join-class" className="btn btn-primary">
          Join New Class
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="classFilter" className="form-label">
                Filter by Class
              </label>
              <select
                id="classFilter"
                className="form-control"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="statusFilter" className="form-label">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="not-started">Not Started</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Assignments ({sortedAssignments.length})
          </h2>
        </div>
        <div className="card-body">
          {sortedAssignments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {assignments.length === 0 
                  ? 'No assignments available yet.' 
                  : 'No assignments match your filters.'
                }
              </p>
              {classes.length === 0 && (
                <Link to="/student/join-class" className="btn btn-primary mt-4">
                  Join Your First Class
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAssignments.map((assignment) => {
                const status = getAssignmentStatus(assignment);
                const score = getAssignmentScore(assignment);
                const overdue = isOverdue(assignment.dueDate);
                
                return (
                  <div
                    key={assignment._id}
                    className={`border rounded-lg p-4 transition-colors hover:bg-gray-50 ${
                      overdue && status === 'not-started' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                          {overdue && status === 'not-started' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Overdue
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {assignment.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span>Class: {assignment.className}</span>
                          <span>Language: {assignment.language}</span>
                          <span>Points: {assignment.totalPoints}</span>
                          <span className={overdue ? 'text-red-600 font-medium' : ''}>
                            Due: {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                            {new Date(assignment.dueDate).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 ml-4">
                        <div className="text-right">
                          {getStatusBadge(status)}
                          {score && (
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              Score: {score}
                            </div>
                          )}
                        </div>
                        
                        <Link
                          to={`/student/assignment/${assignment._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          {status === 'not-started' ? 'Start' : 'View'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {assignments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-gray-900">
                {assignments.length}
              </div>
              <div className="text-sm text-gray-600">Total Assignments</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {assignments.filter(a => getAssignmentStatus(a) === 'submitted').length}
              </div>
              <div className="text-sm text-gray-600">Submitted</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-green-600">
                {assignments.filter(a => getAssignmentStatus(a) === 'graded').length}
              </div>
              <div className="text-sm text-gray-600">Graded</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-red-600">
                {assignments.filter(a => 
                  getAssignmentStatus(a) === 'not-started' && isOverdue(a.dueDate)
                ).length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignmentList;