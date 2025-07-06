import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classAPI, assignmentAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [classesResponse] = await Promise.all([
        classAPI.getAll(),
      ]);
      
      setClasses(classesResponse.data.classes);
      
      // Load assignments for all classes
      const allAssignments = [];
      for (const classItem of classesResponse.data.classes) {
        try {
          const assignmentsResponse = await assignmentAPI.getByClassId(classItem._id);
          allAssignments.push(...assignmentsResponse.data.assignments);
        } catch (error) {
          console.error(`Error loading assignments for class ${classItem._id}:`, error);
        }
      }
      setAssignments(allAssignments);
    } catch (error) {
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <div className="flex space-x-4">
          <Link to="/teacher/create-class" className="btn btn-primary">
            Create Class
          </Link>
          <Link to="/teacher/create-assignment" className="btn btn-secondary">
            Create Assignment
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
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
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((total, cls) => total + cls.students.length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👨‍🎓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Classes */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Your Classes</h2>
        </div>
        <div className="card-body">
          {classes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No classes created yet.</p>
              <Link to="/teacher/create-class" className="btn btn-primary mt-4">
                Create Your First Class
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
                          Join Code: <span className="font-mono font-semibold">{classItem.joinCode}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                          {classItem.students.length} students
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/teacher/create-assignment?classId=${classItem._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Add Assignment
                      </Link>
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
              <p className="text-gray-500">No assignments created yet.</p>
              <Link to="/teacher/create-assignment" className="btn btn-primary mt-4">
                Create Your First Assignment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.slice(0, 5).map((assignment) => (
                <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
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
                    <Link
                      to={`/teacher/submissions/${assignment._id}`}
                      className="btn btn-sm btn-outline"
                    >
                      View Submissions
                    </Link>
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

export default TeacherDashboard;