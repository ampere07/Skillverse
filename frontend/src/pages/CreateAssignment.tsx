import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, Code, Calendar, Award } from 'lucide-react';
import api from '../services/api';
import { Class, TestCase, TemplateCollection } from '../types';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import JavaEditor from '../components/Student/JavaEditor';

const CreateAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [templates, setTemplates] = useState<TemplateCollection>({});
  const [formData, setFormData] = useState({
    classId: '',
    title: '',
    description: '',
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Your code here
        
    }
}`,
    dueDate: '',
    points: 100
  });
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesResponse, templatesResponse] = await Promise.all([
        api.get('/api/classes'),
        api.get('/api/assignments/templates')
      ]);
      
      setClasses(classesResponse.data.classes);
      setTemplates(templatesResponse.data.templates);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!formData.classId) {
      setError('Please select a class');
      setSubmitting(false);
      return;
    }

    try {
      await api.post(`/api/assignments/classes/${formData.classId}`, {
        title: formData.title,
        description: formData.description,
        starterCode: formData.starterCode,
        testCases,
        dueDate: formData.dueDate,
        points: formData.points
      });
      
      navigate('/assignments');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTemplateSelect = (templateKey: string) => {
    const template = templates[templateKey];
    if (template) {
      setFormData({
        ...formData,
        starterCode: template.code
      });
    }
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', hidden: false }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string | boolean) => {
    const updated = testCases.map((testCase, i) => 
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setTestCases(updated);
  };

  const toggleTestCaseVisibility = (index: number) => {
    updateTestCase(index, 'hidden', !testCases[index].hidden);
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Default to 1 week from now
    return formatDateForInput(date);
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
          <h1 className="text-2xl font-bold text-gray-900">Create Assignment</h1>
          <p className="text-gray-600 mt-1">Create a new Java programming assignment</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/assignments')}
        >
          Cancel
        </Button>
      </div>

      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    required
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Variables and Data Types"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe what students need to accomplish..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.dueDate || getDefaultDueDate()}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Award className="inline w-4 h-4 mr-1" />
                      Points
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Cases</h2>
              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">Test Case {index + 1}</h3>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleTestCaseVisibility(index)}
                        >
                          {testCase.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                          {testCase.hidden ? 'Hidden' : 'Visible'}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeTestCase(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Input
                        </label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={2}
                          placeholder="Input for this test case (leave empty for no input)"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expected Output
                        </label>
                        <textarea
                          required
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={2}
                          placeholder="Expected output for this test case"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addTestCase}
                  icon={Plus}
                  fullWidth
                >
                  Add Test Case
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Java Templates</h2>
              <div className="space-y-2">
                {Object.entries(templates).map(([key, template]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{template.title}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleTemplateSelect(key)}
                      >
                        <Code size={16} />
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
              </div>
              <div className="space-y-3">
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting}
                  fullWidth
                  size="lg"
                >
                  Create Assignment
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/assignments')}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Card className="h-96">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              <Code className="inline w-5 h-5 mr-2" />
              Starter Code
            </h2>
          </div>
          <JavaEditor
            initialCode={formData.starterCode}
            onCodeChange={(code) => setFormData({ ...formData, starterCode: code })}
            showSaveButton={false}
          />
        </Card>
      </form>
    </div>
  );
};

export default CreateAssignmentPage;