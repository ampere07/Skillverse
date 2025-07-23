import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, AlertCircle, Code } from 'lucide-react';
import api from '../../services/api';
import { Assignment } from '../../types';
import Card from '../Common/Card';
import Button from '../Common/Button';

const AssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      // Get all classes first, then get assignments for each class
      const classesResponse = await api.get('/api/classes');
      const classes = classesResponse.data.classes;

      const allAssignments: Assignment[] = [];
      
      for (const classItem of classes) {
        try {
          const assignmentsResponse = await api.get(`/api/assignments/classes/${classItem._id}`);
          const classAssignments = assignmentsResponse.data.assignments.map((assignment: Assignment) => ({
            ...assignment,
            className: classItem.name
          }));
          allAssignments.push(...classAssignments);
        } catch (error) {
          console.error(`Error fetching assignments for class ${classItem.name}:`, error);
        }
      }

      setAssignments(allAssignments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const hasSubmission = assignment.submission;

    if (hasSubmission) {
      if (hasSubmission.status === 'graded') {
        return (
          <span className="grade-badge status-graded">
            <CheckCircle size={14} className="mr-1" />
            Graded ({hasSubmission.grade}/100)
          </span>
        );
      } else {
        return (
          <span className="grade-badge status-pending">
            <Clock size={14} className="mr-1" />
            Submitted
          </span>
        );
      }
    } else if (now > dueDate) {
      return (
        <span className="grade-badge status-overdue">
          <AlertCircle size={14} className="mr-1" />
          Overdue
        </span>
      );
    } else {
      return (
        <span className="grade-badge status-pending">
          <Clock size={14} className="mr-1" />
          Pending
        </span>
      );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
      </div>

      {assignments.length === 0 ? (
        <Card className="text-center py-12">
          <Code className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-500">
            Join a class to start receiving Java programming assignments.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <Card key={assignment._id} hover className="relative">
              <div className="absolute top-4 right-4">
                {getStatusBadge(assignment)}
              </div>
              
              <div className="pr-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {assignment.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {assignment.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Due: {formatDate(assignment.dueDate)}
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Points: {assignment.points}
                  </div>
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Class: {(assignment as any).className}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link to={`/assignment/${assignment._id}`}>
                  <Button fullWidth>
                    {assignment.submission ? 'View Submission' : 'Start Assignment'}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;