import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Plus, BookOpen, TrendingUp, Clock, Award } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';

interface DashboardStats {
  totalClasses: number;
  totalAssignments: number;
  totalStudents: number;
  pendingSubmissions: number;
  recentAssignments: any[];
  recentSubmissions: any[];
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalAssignments: 0,
    totalStudents: 0,
    pendingSubmissions: 0,
    recentAssignments: [],
    recentSubmissions: []
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
      
      // Calculate total students
      const totalStudents = classes.reduce((sum: number, cls: any) => sum + cls.students.length, 0);
      
      // Fetch assignments for all classes
      const allAssignments = [];
      for (const cls of classes) {
        try {
          const assignmentsResponse = await api.get(`/api/assignments/classes/${cls._id}`);
          allAssignments.push(...assignmentsResponse.data.assignments);
        } catch (error) {
          console.error(`Error fetching assignments for class ${cls.name}:`, error);
        }
      }
      
      // Fetch recent submissions
      let allSubmissions = [];
      for (const assignment of allAssignments) {
        try {
          const submissionsResponse = await api.get(`/api/submissions/assignments/${assignment._id}`);
          allSubmissions.push(...submissionsResponse.data.submissions);
        } catch (error) {
          console.error(`Error fetching submissions for assignment ${assignment.title}:`, error);
        }
      }
      
      const pendingSubmissions = allSubmissions.filter((sub: any) => sub.status === 'pending').length;
      
      setStats({
        totalClasses: classes.length,
        totalAssignments: allAssignments.length,
        totalStudents,
        pendingSubmissions,
        recentAssignments: allAssignments.slice(0, 5),
        recentSubmissions: allSubmissions.slice(0, 5)
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
          <p className="text-gray-600 mt-2">Manage your Java programming classes and assignments</p>
        </div>
        <Link to="/create-assignment">
          <Button icon={Plus} size="lg">
            Create Assignment
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100">Total Classes</p>
              <p className="text-3xl font-bold">{stats.totalClasses}</p>
            </div>
            <Users className="h-12 w-12 text-primary-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100">Total Assignments</p>
              <p className="text-3xl font-bold">{stats.totalAssignments}</p>
            </div>
            <FileText className="h-12 w-12 text-success-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100">Total Students</p>
              <p className="text-3xl font-bold">{stats.totalStudents}</p>
            </div>
            <BookOpen className="h-12 w-12 text-secondary-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100">Pending Grades</p>
              <p className="text-3xl font-bold">{stats.pendingSubmissions}</p>
            </div>
            <Clock className="h-12 w-12 text-warning-200" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <Link to="/create-assignment">
              <Button variant="primary" fullWidth className="justify-start">
                <Plus className="mr-2" size={18} />
                Create New Assignment
              </Button>
            </Link>
            <Link to="/classes">
              <Button variant="secondary" fullWidth className="justify-start">
                <Users className="mr-2" size={18} />
                Manage Classes
              </Button>
            </Link>
            <Link to="/grading">
              <Button variant="secondary" fullWidth className="justify-start">
                <Award className="mr-2" size={18} />
                Grade Submissions
              </Button>
            </Link>
          </div>
        </Card>

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
              stats.recentAssignments.map((assignment: any) => (
                <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-500">Due: {formatDate(assignment.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{assignment.points} pts</p>
                    <Link to={`/assignment/${assignment._id}`} className="text-primary-600 hover:text-primary-500 text-sm">
                      View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {stats.recentSubmissions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent submissions</p>
          ) : (
            stats.recentSubmissions.map((submission: any) => (
              <div key={submission._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{submission.studentId.name}</p>
                  <p className="text-sm text-gray-500">Submitted assignment</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(submission.submittedAt)}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    submission.status === 'graded' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                  }`}>
                    {submission.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default TeacherDashboard;