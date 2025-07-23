import { Response } from 'express';
import Assignment from '../models/Assignment';
import Submission from '../models/Submission';
import Class from '../models/Class';
import { AuthRequest } from '../middleware/auth';

export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // assignment id
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    // Check if assignment exists
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user has access to this assignment
    const classDoc = await Class.findById(assignment.classId);
    if (!classDoc || !classDoc.students.includes(req.user!._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if assignment is past due
    if (new Date() > assignment.dueDate) {
      return res.status(400).json({ message: 'Assignment is past due' });
    }

    // Update existing submission or create new one
    const existingSubmission = await Submission.findOne({
      assignmentId: id,
      studentId: req.user!._id
    });

    if (existingSubmission) {
      existingSubmission.code = code;
      existingSubmission.submittedAt = new Date();
      existingSubmission.compilationStatus = null;
      existingSubmission.output = null;
      await existingSubmission.save();
      
      return res.json({
        message: 'Assignment resubmitted successfully',
        submission: existingSubmission
      });
    } else {
      const submission = new Submission({
        assignmentId: id,
        studentId: req.user!._id,
        code
      });

      await submission.save();

      res.status(201).json({
        message: 'Assignment submitted successfully',
        submission
      });
    }
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // assignment id

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is the teacher of this assignment's class
    const classDoc = await Class.findById(assignment.classId);
    if (!classDoc || classDoc.teacherId.toString() !== req.user!._id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submissions = await Submission.find({ assignmentId: id })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // assignment id

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user has access to this assignment
    const classDoc = await Class.findById(assignment.classId);
    if (!classDoc || !classDoc.students.includes(req.user!._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submission = await Submission.findOne({
      assignmentId: id,
      studentId: req.user!._id
    });

    res.json({ submission });
  } catch (error) {
    console.error('Get student submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const gradeSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // submission id
    const { grade, feedback } = req.body;

    if (grade === undefined || grade < 0 || grade > 100) {
      return res.status(400).json({ message: 'Grade must be between 0 and 100' });
    }

    const submission = await Submission.findById(id).populate('assignmentId');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if user is the teacher of this submission's assignment's class
    const classDoc = await Class.findById(submission.assignmentId.classId);
    if (!classDoc || classDoc.teacherId.toString() !== req.user!._id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    submission.grade = grade;
    submission.feedback = feedback || '';
    submission.status = 'graded';

    await submission.save();

    res.json({
      message: 'Submission graded successfully',
      submission
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};