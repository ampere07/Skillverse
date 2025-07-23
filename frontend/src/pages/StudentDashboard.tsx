import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, FileText, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Assignment } from '../types';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';

interface DashboardStats {
  totalClasses: number;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  recentAssignments: Assignment[];
  upcomingDueDates: Assignment[];
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    recentAssignments: [],
    upcomingDueDates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch classes
      const classesResponse = await api.get('/api/classes');
      const classes = classesResponse.data.classes;
      
      // Fetch assignments for all classes
      const allAssignments: Assignment[] = [];
      for (const cls of classes) {
        try {
          const assignmentsResponse = await api.get(`/api/assignments/classes/${cls._id}`);
          const classAssignments = assignmentsResponse.data.assignments.map((assignment: Assignment) => ({
            ...assignment,
            className: cls.name
          }));
          allAssignments.push(...classAssignments);
        } catch (error) {
          console.error(`Error fetching assignments for class ${cls.name}:`, error);
        }
      }
      
      // Calculate stats
      const completedAssignments = allAssignments.filter(a => a.submission).length;
      const pendingAssignments = allAssignments.filter(a => !a.submission).length;
      
      // Get upcoming due dates (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcomingDueDates = allAssignments
        .filter(a => new Date(a.dueDate) <= nextWeek && new Date(a.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);
      
      setStats({
        totalClasses: classes.length,
        totalAssignments: allAssignments.length,
        completedAssignments,
        pendingAssignments,
        recentAssignments: allAssignments.slice(0, 5),
        upcomingDueDates
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Continue your Java programming journey</p>
        </div>
        <Link to="/assignments">
          <Button icon={Code} size="lg">
            View Assignments
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100">Enrolled Classes</p>
              <p className="text-3xl font-bold">{stats.totalClasses}</p>
            </div>
            <Code className="h-12 w-12 text-primary-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100">Completed</p>
              <p className="text-3xl font-bold">{stats.completedAssignments}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-success-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100">Pending</p>
              <p className="text-3xl font-bold">{stats.pendingAssignments}</p>
            </div>
            <Clock className="h-12 w-12 text-warning-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100">Total Assignments</p>
              <p className="text-3xl font-bold">{stats.totalAssignments}</p>
            </div>
            <FileText className="h-12 w-12 text-secondary-200" />
          </div>
        </Card>
      </div>

      {/* Quick Actions and Upcoming Due Dates */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <Link to="/assignments">
              <Button variant="primary" fullWidth className="justify-start">
                <FileText className="mr-2" size={18} />
                View All Assignments
              </Button>
            </Link>
            <Link to="/classes">
              <Button variant="secondary" fullWidth className="justify-start">
                <Code className="mr-2" size={18} />
                My Classes
              </Button>
            </Link>
            <Link to="/submissions">
              <Button variant="secondary" fullWidth className="justify-start">
                <CheckCircle className="mr-2" size={18} />
                My Submissions
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Due Dates</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.upcomingDueDates.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming due dates</p>
            ) : (
              stats.upcomingDueDates.map((assignment) => (
                <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-500">{(assignment as any).className}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatDate(assignment.dueDate)}</p>
                    <p className={`text-xs ${
                      getTimeUntilDue(assignment.dueDate).includes('today') || 
                      getTimeUntilDue(assignment.dueDate).includes('tomorrow') ? 
                      'text-danger-600' : 'text-gray-500'
                    }`}>
                      {getTimeUntilDue(assignment.dueDate)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Assignments</h2>
          <Link to="/assignments" className="text-primary-600 hover:text-primary-500 text-sm">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {stats.recentAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No assignments yet</p>
          ) : (
            stats.recentAssignments.map((assignment) => (
              <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    assignment.submission ? 'bg-success-500' : 'bg-warning-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-500">{(assignment as any).className}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(assignment.dueDate)}</p>
                  <Link to={`/assignment/${assignment._id}`} className="text-primary-600 hover:text-primary-500 text-sm">
                    {assignment.submission ? 'View Submission' : 'Start Assignment'}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;