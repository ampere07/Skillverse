const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  teacherFeedback: {
    type: String,
    default: ''
  },
  aiAnalysis: {
    codeQuality: {
      type: Number,
      min: 0,
      max: 100
    },
    efficiency: {
      type: Number,
      min: 0,
      max: 100
    },
    correctness: {
      type: Number,
      min: 0,
      max: 100
    },
    suggestions: [String]
  },
  testResults: [{
    testCase: {
      input: String,
      expectedOutput: String
    },
    actualOutput: String,
    passed: Boolean,
    executionTime: Number
  }],
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gradedAt: Date,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'graded', 'needs_review'],
    default: 'pending'
  }
});

// Compound index for efficient queries
submissionSchema.index({ assignmentId: 1, studentId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);