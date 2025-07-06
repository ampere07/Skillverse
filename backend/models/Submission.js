const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  grade: {
    type: Number,
    min: 0,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'graded'],
    default: 'pending',
  },
});

// Ensure one submission per student per assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);