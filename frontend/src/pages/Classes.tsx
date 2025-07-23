import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Copy, CheckCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Class } from '../types';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';

const ClassesPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/classes');
      setClasses(response.data.classes);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/api/classes', {
        name: formData.name,
        description: formData.description
      });
      setShowCreateForm(false);
      setFormData({ name: '', description: '', code: '' });
      fetchClasses();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/api/classes/join', {
        code: formData.code
      });
      setShowJoinForm(false);
      setFormData({ name: '', description: '', code: '' });
      fetchClasses();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to join class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/classes/${classId}`);
      fetchClasses();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete class');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'teacher' ? 'My Classes' : 'Enrolled Classes'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'teacher' 
              ? 'Create and manage your Java programming classes'
              : 'View your enrolled Java programming classes'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          {user?.role === 'teacher' ? (
            <Button icon={Plus} onClick={() => setShowCreateForm(true)}>
              Create Class
            </Button>
          ) : (
            <Button icon={Plus} onClick={() => setShowJoinForm(true)}>
              Join Class
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Class Form */}
      {showCreateForm && (
        <Card>
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Create New Class</h2>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Java Programming 101"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Brief description of the class..."
              />
            </div>
            
            <Button type="submit" loading={submitting}>
              Create Class
            </Button>
          </form>
        </Card>
      )}

      {/* Join Class Form */}
      {showJoinForm && (
        <Card>
          <form onSubmit={handleJoinClass} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Join Class</h2>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowJoinForm(false)}
              >
                Cancel
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Code
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter 6-character class code"
                maxLength={6}
              />
            </div>
            
            <Button type="submit" loading={submitting}>
              Join Class
            </Button>
          </form>
        </Card>
      )}

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {user?.role === 'teacher' ? 'No classes created yet' : 'No classes joined yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {user?.role === 'teacher' 
              ? 'Create your first class to start teaching Java programming'
              : 'Join a class using the class code provided by your teacher'
            }
          </p>
          <Button
            onClick={() => user?.role === 'teacher' ? setShowCreateForm(true) : setShowJoinForm(true)}
            icon={Plus}
          >
            {user?.role === 'teacher' ? 'Create Class' : 'Join Class'}
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <Card key={classItem._id} hover>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {classItem.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {classItem.description || 'No description'}
                  </p>
                </div>
                {user?.role === 'teacher' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClass(classItem._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Class Code:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                      {classItem.code}
                    </code>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopyCode(classItem.code)}
                    >
                      {copiedCode === classItem.code ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Students:</span>
                  <div className="flex items-center space-x-1">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {Array.isArray(classItem.students) ? classItem.students.length : 0}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {formatDate(classItem.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button fullWidth>
                    View Assignments
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;