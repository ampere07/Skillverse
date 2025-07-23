import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Class from '../models/Class';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateClassCode = (): string => {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
};

export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Class name is required' });
    }

    let code = generateClassCode();
    
    // Ensure code is unique
    let existingClass = await Class.findOne({ code });
    while (existingClass) {
      code = generateClassCode();
      existingClass = await Class.findOne({ code });
    }

    const newClass = new Class({
      name,
      code,
      teacherId: req.user!._id,
      description: description || '',
      students: []
    });

    await newClass.save();

    res.status(201).json({
      message: 'Class created successfully',
      class: newClass
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinClass = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Class code is required' });
    }

    const classToJoin = await Class.findOne({ code });
    if (!classToJoin) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if student is already in the class
    if (classToJoin.students.includes(req.user!._id)) {
      return res.status(400).json({ message: 'You are already enrolled in this class' });
    }

    // Add student to class
    classToJoin.students.push(req.user!._id);
    await classToJoin.save();

    res.json({
      message: 'Successfully joined class',
      class: classToJoin
    });
  } catch (error) {
    console.error('Join class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClasses = async (req: AuthRequest, res: Response) => {
  try {
    let classes;
    
    if (req.user!.role === 'teacher') {
      classes = await Class.find({ teacherId: req.user!._id })
        .populate('students', 'name email')
        .sort({ createdAt: -1 });
    } else {
      classes = await Class.find({ students: req.user!._id })
        .populate('teacherId', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json({ classes });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const classDoc = await Class.findById(id)
      .populate('teacherId', 'name email')
      .populate('students', 'name email');

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if user has access to this class
    const hasAccess = classDoc.teacherId._id.toString() === req.user!._id || 
                     classDoc.students.some((student: any) => student._id.toString() === req.user!._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ class: classDoc });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const classDoc = await Class.findById(id);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if user is the teacher of this class
    if (classDoc.teacherId.toString() !== req.user!._id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Class.findByIdAndDelete(id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};