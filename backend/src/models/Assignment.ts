import mongoose, { Document, Schema } from 'mongoose';

export interface ITestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface IAssignment extends Document {
  _id: string;
  classId: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: ITestCase[];
  dueDate: Date;
  points: number;
  createdAt: Date;
}

const TestCaseSchema: Schema = new Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
});

const AssignmentSchema: Schema = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  starterCode: {
    type: String,
    required: true,
    default: `public class Main {
    public static void main(String[] args) {
        // Your code here
        
    }
}`
  },
  testCases: [TestCaseSchema],
  dueDate: {
    type: Date,
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);