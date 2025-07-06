const express = require('express');
const { body, validationResult } = require('express-validator');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { requireAuth, requireTeacher } = require('../middleware/auth');

const router = express.Router();

// Submit solution (student only)
router.post('/', requireAuth, [
  body('assignmentId').isMongoId(),
  body('code').trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assignmentId, code } = req.body;
    const userId = req.session.user.id;

    if (req.session.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit solutions' });
    }

    // Verify assignment exists and student has access
    const assignment = await Assignment.findById(assignmentId)
      .populate('classId', 'students');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (!assignment.classId.students.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignmentId,
      studentId: userId,
    });

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.code = code;
      existingSubmission.submittedAt = new Date();
      existingSubmission.status = 'pending';
      existingSubmission.grade = null;
      existingSubmission.feedback = '';
      
      await existingSubmission.save();
      
      return res.json({
        message: 'Submission updated successfully',
        submission: existingSubmission,
      });
    }

    // Create new submission
    const submission = new Submission({
      assignmentId,
      studentId: userId,
      code,
    });

    await submission.save();

    res.status(201).json({
      message: 'Solution submitted successfully',
      submission,
    });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get submissions for assignment (teacher only)
router.get('/assignment/:assignmentId', requireTeacher, async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const userId = req.session.user.id;

    // Verify teacher owns the assignment
    const assignment = await Assignment.findById(assignmentId)
      .populate('classId', 'teacherId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.classId.teacherId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's submission for assignment
router.get('/my/:assignmentId', requireAuth, async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const userId = req.session.user.id;

    if (req.session.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can view their submissions' });
    }

    const submission = await Submission.findOne({
      assignmentId,
      studentId: userId,
    }).populate('assignmentId', 'title totalPoints');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Get my submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Grade submission (teacher only)
router.put('/:id/grade', requireTeacher, [
  body('grade').isInt({ min: 0 }),
  body('feedback').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const submissionId = req.params.id;
    const userId = req.session.user.id;
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(submissionId)
      .populate({
        path: 'assignmentId',
        populate: {
          path: 'classId',
          select: 'teacherId',
        },
      });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify teacher owns the assignment
    if (submission.assignmentId.classId.teacherId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if grade is within valid range
    if (grade > submission.assignmentId.totalPoints) {
      return res.status(400).json({ 
        message: `Grade cannot exceed ${submission.assignmentId.totalPoints} points` 
      });
    }

    submission.grade = grade;
    submission.feedback = feedback || '';
    submission.status = 'graded';

    await submission.save();

    res.json({
      message: 'Submission graded successfully',
      submission,
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;