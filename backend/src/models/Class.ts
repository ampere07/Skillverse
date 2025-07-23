import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  _id: string;
  name: string;
  code: string;
  teacherId: string;
  students: string[];
  description: string;
  createdAt: Date;
}

const ClassSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    length: 6
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IClass>('Class', ClassSchema);