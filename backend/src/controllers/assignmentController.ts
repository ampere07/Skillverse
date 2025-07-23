import { Response } from 'express';
import Assignment from '../models/Assignment';
import Class from '../models/Class';
import Submission from '../models/Submission';
import { AuthRequest } from '../middleware/auth';

export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { classId } = req.params;
    const { title, description, starterCode, testCases, dueDate, points } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate || !points) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if class exists and user is the teacher
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (classDoc.teacherId.toString() !== req.user!._id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignment = new Assignment({
      classId,
      title,
      description,
      starterCode: starterCode || `public class Main {
    public static void main(String[] args) {
        // Your code here
        
    }
}`,
      testCases: testCases || [],
      dueDate: new Date(dueDate),
      points: parseInt(points)
    });

    await assignment.save();

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const { classId } = req.params;

    // Check if user has access to this class
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const hasAccess = classDoc.teacherId.toString() === req.user!._id || 
                     classDoc.students.includes(req.user!._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignments = await Assignment.find({ classId }).sort({ createdAt: -1 });

    // If student, also get their submissions
    if (req.user!.role === 'student') {
      const assignmentIds = assignments.map(a => a._id);
      const submissions = await Submission.find({ 
        assignmentId: { $in: assignmentIds }, 
        studentId: req.user!._id 
      });

      const submissionMap = new Map();
      submissions.forEach(sub => {
        submissionMap.set(sub.assignmentId.toString(), sub);
      });

      const assignmentsWithSubmissions = assignments.map(assignment => ({
        ...assignment.toObject(),
        submission: submissionMap.get(assignment._id.toString()) || null
      }));

      return res.json({ assignments: assignmentsWithSubmissions });
    }

    res.json({ assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id).populate('classId');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user has access to this assignment
    const classDoc = await Class.findById(assignment.classId);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const hasAccess = classDoc.teacherId.toString() === req.user!._id || 
                     classDoc.students.includes(req.user!._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If student, get their submission
    let submission = null;
    if (req.user!.role === 'student') {
      submission = await Submission.findOne({ 
        assignmentId: id, 
        studentId: req.user!._id 
      });
    }

    res.json({ assignment, submission });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, starterCode, testCases, dueDate, points } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is the teacher of this assignment's class
    const classDoc = await Class.findById(assignment.classId);
    if (!classDoc || classDoc.teacherId.toString() !== req.user!._id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update assignment
    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.starterCode = starterCode || assignment.starterCode;
    assignment.testCases = testCases || assignment.testCases;
    assignment.dueDate = dueDate ? new Date(dueDate) : assignment.dueDate;
    assignment.points = points ? parseInt(points) : assignment.points;

    await assignment.save();

    res.json({
      message: 'Assignment updated successfully',
      assignment
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is the teacher of this assignment's class
    const classDoc = await Class.findById(assignment.classId);
    if (!classDoc || classDoc.teacherId.toString() !== req.user!._id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Assignment.findByIdAndDelete(id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};