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
    enum: ['pending', 'graded'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Submission', submissionSchema);