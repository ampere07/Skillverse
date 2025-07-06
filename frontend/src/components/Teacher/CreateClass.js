import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function CreateClass() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      showError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await classAPI.create(formData.name, formData.description);
      showSuccess('Class created successfully!');
      navigate('/teacher/dashboard');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Class</h1>
        <p className="text-gray-600 mt-2">
          Create a new class and get a unique join code for your students.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="form-label">
                Class Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="form-control"
                placeholder="e.g., Introduction to Programming"
                value={formData.name}
                onChange={handleChange}
              />
              <p className="form-help">
                Choose a descriptive name for your class
              </p>
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Class Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="form-control"
                placeholder="Describe what this class is about, learning objectives, etc."
                value={formData.description}
                onChange={handleChange}
              />
              <p className="form-help">
                Provide details about the class content and objectives
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-blue-500 text-xl">💡</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    What happens next?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>A unique 6-character join code will be generated</li>
                      <li>Students can use this code to join your class</li>
                      <li>You can start creating assignments immediately</li>
                      <li>View and manage all enrolled students</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/teacher/dashboard')}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating Class...
                  </>
                ) : (
                  'Create Class'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Section */}
      {(formData.name || formData.description) && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="card">
            <div className="card-body">
              <h3 className="font-semibold text-gray-900">
                {formData.name || 'Class Name'}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {formData.description || 'Class description will appear here...'}
              </p>
              <div className="flex items-center mt-3 space-x-4">
                <span className="text-sm text-gray-500">
                  Join Code: <span className="font-mono font-semibold">ABC123</span>
                </span>
                <span className="text-sm text-gray-500">
                  0 students enrolled
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateClass;