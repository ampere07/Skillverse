import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  _id: string;
  assignmentId: string;
  studentId: string;
  code: string;
  submittedAt: Date;
  grade: number | null;
  feedback: string | null;
  status: 'pending' | 'graded';
  compilationStatus: 'success' | 'error' | null;
  output: string | null;
}

const SubmissionSchema: Schema = new Schema({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  feedback: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'graded'],
    default: 'pending'
  },
  compilationStatus: {
    type: String,
    enum: ['success', 'error'],
    default: null
  },
  output: {
    type: String,
    default: null
  }
});

// Compound index to ensure one submission per student per assignment
SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);