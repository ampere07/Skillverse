import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { assignmentAPI, classAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function CreateAssignment() {
  const [searchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    classId: searchParams.get('classId') || '',
    title: '',
    description: '',
    language: 'python',
    starterCode: '',
    testCases: [{ input: '', expectedOutput: '' }],
    dueDate: '',
    totalPoints: 100,
  });
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classAPI.getAll();
      setClasses(response.data.classes);
    } catch (error) {
      showError('Failed to load classes');
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData(prev => ({
      ...prev,
      testCases: newTestCases,
    }));
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }],
    }));
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length > 1) {
      const newTestCases = formData.testCases.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        testCases: newTestCases,
      }));
    }
  };

  const getStarterCodeTemplate = (language) => {
    const templates = {
      python: `def solution():
    # Write your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,
      javascript: `function solution() {
    // Write your code here
    return null;
}

// Test your solution
console.log(solution());`,
      java: `public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test your solution
        System.out.println(sol.solution());
    }
    
    public Object solution() {
        // Write your code here
        return null;
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    
    return 0;
}`
    };
    return templates[language] || '';
  };

  useEffect(() => {
    if (formData.language && !formData.starterCode) {
      setFormData(prev => ({
        ...prev,
        starterCode: getStarterCodeTemplate(formData.language),
      }));
    }
  }, [formData.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.classId || !formData.title.trim() || !formData.description.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    if (!formData.dueDate) {
      showError('Please select a due date');
      return;
    }

    if (formData.testCases.some(tc => !tc.input.trim() || !tc.expectedOutput.trim())) {
      showError('Please fill in all test cases');
      return;
    }

    setLoading(true);

    try {
      await assignmentAPI.create(formData);
      showSuccess('Assignment created successfully!');
      navigate('/teacher/dashboard');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  if (loadingClasses) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Assignment</h1>
        <p className="text-gray-600 mt-2">
          Create a coding assignment with test cases for your students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
          </div>
          <div className="card-body space-y-6">
            <div>
              <label htmlFor="classId" className="form-label">
                Select Class *
              </label>
              <select
                id="classId"
                name="classId"
                required
                className="form-control"
                value={formData.classId}
                onChange={handleChange}
              >
                <option value="">Choose a class...</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="title" className="form-label">
                Assignment Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="form-control"
                placeholder="e.g., Two Sum Problem"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Problem Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                className="form-control"
                placeholder="Describe the problem, requirements, constraints, and examples..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="language" className="form-label">
                  Programming Language *
                </label>
                <select
                  id="language"
                  name="language"
                  required
                  className="form-control"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div>
                <label htmlFor="totalPoints" className="form-label">
                  Total Points *
                </label>
                <input
                  type="number"
                  id="totalPoints"
                  name="totalPoints"
                  required
                  min="1"
                  className="form-control"
                  value={formData.totalPoints}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="form-label">
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  name="dueDate"
                  required
                  className="form-control"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Starter Code */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Starter Code</h2>
          </div>
          <div className="card-body">
            <div>
              <label htmlFor="starterCode" className="form-label">
                Starter Code Template
              </label>
              <textarea
                id="starterCode"
                name="starterCode"
                rows={12}
                className="form-control font-mono text-sm"
                placeholder="Provide starter code for students..."
                value={formData.starterCode}
                onChange={handleChange}
              />
              <p className="form-help">
                This code will be pre-filled in the editor for students
              </p>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Test Cases</h2>
              <button
                type="button"
                onClick={addTestCase}
                className="btn btn-sm btn-primary"
              >
                Add Test Case
              </button>
            </div>
          </div>
          <div className="card-body space-y-4">
            {formData.testCases.map((testCase, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Test Case {index + 1}</h3>
                  {formData.testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="btn btn-sm btn-danger"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Input</label>
                    <textarea
                      rows={3}
                      className="form-control font-mono text-sm"
                      placeholder="Enter test input..."
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Expected Output</label>
                    <textarea
                      rows={3}
                      className="form-control font-mono text-sm"
                      placeholder="Enter expected output..."
                      value={testCase.expectedOutput}
                      onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
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
                Creating Assignment...
              </>
            ) : (
              'Create Assignment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAssignment;