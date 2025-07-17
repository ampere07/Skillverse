const express = require('express');
const { requireRole } = require('../middleware/auth');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const router = express.Router();

// All teacher routes require teacher role
router.use(requireRole('teacher'));

// Teacher Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const teacherId = req.session.userId;
    
    // Get teacher's classes
    const classes = await Class.find({ teacherId });
    
    // Get pending submissions
    const assignments = await Assignment.find({
      classId: { $in: classes.map(c => c._id) }
    });
    
    const pendingSubmissions = await Submission.find({
      assignmentId: { $in: assignments.map(a => a._id) },
      status: 'pending'
    }).populate('assignmentId', 'title')
      .populate('studentId', 'name');
    
    res.json({
      classes: classes.length,
      students: classes.reduce((acc, c) => acc + c.students.length, 0),
      assignments: assignments.length,
      pendingSubmissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher's classes
router.get('/classes', async (req, res) => {
  try {
    const teacherId = req.session.userId;
    const classes = await Class.find({ teacherId })
      .populate('students', 'name email');
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new class
router.post('/classes', async (req, res) => {
  try {
    const { name, subject, description, theme } = req.body;
    const teacherId = req.session.userId;
    
    const newClass = new Class({
      name,
      subject,
      description,
      theme,
      teacherId
    });
    
    await newClass.save();
    
    res.status(201).json({
      message: 'Class created successfully',
      class: newClass
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher's assignments
router.get('/assignments', async (req, res) => {
  try {
    const teacherId = req.session.userId;
    const classes = await Class.find({ teacherId });
    
    const assignments = await Assignment.find({
      classId: { $in: classes.map(c => c._id) }
    }).populate('classId', 'name');
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new assignment
router.post('/assignments', async (req, res) => {
  try {
    const {
      classId,
      title,
      description,
      starterCode,
      language,
      difficulty,
      skills,
      testCases,
      dueDate,
      totalPoints
    } = req.body;
    
    const teacherId = req.session.userId;
    
    // Verify teacher owns the class
    const classObj = await Class.findById(classId);
    if (!classObj || !classObj.teacherId.equals(teacherId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const assignment = new Assignment({
      classId,
      title,
      description,
      starterCode,
      language,
      difficulty,
      skills,
      testCases,
      dueDate,
      totalPoints
    });
    
    await assignment.save();
    
    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get submissions for an assignment
router.get('/submissions/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const teacherId = req.session.userId;
    
    const assignment = await Assignment.findById(assignmentId)
      .populate('classId');
    
    if (!assignment || !assignment.classId.teacherId.equals(teacherId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email');
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Grade a submission
router.post('/grade/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    const teacherId = req.session.userId;
    
    const submission = await Submission.findById(submissionId)
      .populate({
        path: 'assignmentId',
        populate: {
          path: 'classId',
          select: 'teacherId'
        }
      });
    
    if (!submission || !submission.assignmentId.classId.teacherId.equals(teacherId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    submission.grade = grade;
    submission.teacherFeedback = feedback;
    submission.status = 'graded';
    submission.gradedBy = teacherId;
    submission.gradedAt = new Date();
    
    await submission.save();
    
    res.json({
      message: 'Submission graded successfully',
      submission
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;