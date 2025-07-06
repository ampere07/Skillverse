import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function JoinClass() {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      showError('Please enter a join code');
      return;
    }

    if (joinCode.length !== 6) {
      showError('Join code must be 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await classAPI.join(joinCode.toUpperCase());
      showSuccess(`Successfully joined ${response.data.class.name}!`);
      navigate('/student/dashboard');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to join class');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setJoinCode(value);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Join a Class</h1>
        <p className="text-gray-600 mt-2">
          Enter the 6-character join code provided by your teacher.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="joinCode" className="form-label">
                Class Join Code
              </label>
              <input
                type="text"
                id="joinCode"
                required
                className="form-control text-center text-2xl font-mono tracking-widest"
                placeholder="ABC123"
                value={joinCode}
                onChange={handleInputChange}
                maxLength={6}
                style={{ letterSpacing: '0.5em' }}
              />
              <p className="form-help text-center">
                Enter the 6-character code (letters and numbers)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || joinCode.length !== 6}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Joining Class...
                </>
              ) : (
                'Join Class'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-blue-500 text-xl">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Need help?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Ask your teacher for the 6-character join code</li>
                  <li>The code contains only letters and numbers</li>
                  <li>Codes are case-insensitive (ABC123 = abc123)</li>
                  <li>Each class has a unique join code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="mt-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">
            Demo Join Code
          </h3>
          <p className="text-sm text-gray-600">
            For testing purposes, you can use: <span className="font-mono font-semibold">DEMO01</span>
          </p>
          <button
            type="button"
            onClick={() => setJoinCode('DEMO01')}
            className="btn btn-sm btn-outline mt-2"
          >
            Use Demo Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinClass;