const express = require('express');
const { requireRole } = require('../middleware/auth');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const router = express.Router();

// All student routes require student role
router.use(requireRole('student'));

// Student Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const studentId = req.session.userId;
    
    // Get student's classes
    const classes = await Class.find({ students: studentId })
      .populate('teacherId', 'name');
    
    // Get assignments due this week
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const assignments = await Assignment.find({
      classId: { $in: classes.map(c => c._id) },
      dueDate: { $gte: new Date(), $lte: oneWeekFromNow },
      isActive: true
    }).populate('classId', 'name');
    
    // Get recent submissions
    const submissions = await Submission.find({ studentId })
      .sort({ submittedAt: -1 })
      .limit(5)
      .populate('assignmentId', 'title totalPoints');
    
    res.json({
      classes: classes.length,
      assignments,
      submissions,
      stats: {
        completedAssignments: submissions.filter(s => s.status === 'graded').length,
        averageGrade: submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / submissions.length || 0,
        streak: 5 // Placeholder
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student's classes
router.get('/classes', async (req, res) => {
  try {
    const studentId = req.session.userId;
    const classes = await Class.find({ students: studentId })
      .populate('teacherId', 'name');
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join a class
router.post('/classes/join', async (req, res) => {
  try {
    const { classCode } = req.body;
    const studentId = req.session.userId;
    
    const classToJoin = await Class.findOne({ code: classCode });
    if (!classToJoin) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    if (classToJoin.students.includes(studentId)) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }
    
    classToJoin.students.push(studentId);
    await classToJoin.save();
    
    res.json({ message: 'Successfully joined class', class: classToJoin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student's assignments
router.get('/assignments', async (req, res) => {
  try {
    const studentId = req.session.userId;
    const { status } = req.query;
    
    const classes = await Class.find({ students: studentId });
    const classIds = classes.map(c => c._id);
    
    let assignments = await Assignment.find({
      classId: { $in: classIds },
      isActive: true
    }).populate('classId', 'name');
    
    // Get submissions for these assignments
    const submissions = await Submission.find({
      studentId,
      assignmentId: { $in: assignments.map(a => a._id) }
    });
    
    // Add submission status to assignments
    assignments = assignments.map(assignment => {
      const submission = submissions.find(s => s.assignmentId.equals(assignment._id));
      return {
        ...assignment.toObject(),
        submission: submission || null,
        status: submission ? (submission.status === 'graded' ? 'completed' : 'submitted') : 'todo'
      };
    });
    
    // Filter by status if provided
    if (status) {
      assignments = assignments.filter(a => a.status === status);
    }
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get specific assignment
router.get('/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.session.userId;
    
    const assignment = await Assignment.findById(id)
      .populate('classId', 'name');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if student is enrolled in the class
    const classObj = await Class.findById(assignment.classId);
    if (!classObj.students.includes(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get student's submission if exists
    const submission = await Submission.findOne({
      assignmentId: id,
      studentId
    });
    
    res.json({
      ...assignment.toObject(),
      submission
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit assignment
router.post('/submit/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { code } = req.body;
    const studentId = req.session.userId;
    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if student is enrolled in the class
    const classObj = await Class.findById(assignment.classId);
    if (!classObj.students.includes(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if already submitted
    let submission = await Submission.findOne({
      assignmentId,
      studentId
    });
    
    if (submission) {
      // Update existing submission
      submission.code = code;
      submission.submittedAt = new Date();
      submission.status = 'pending';
    } else {
      // Create new submission
      submission = new Submission({
        assignmentId,
        studentId,
        code,
        language: assignment.language
      });
    }
    
    await submission.save();
    
    res.json({
      message: 'Assignment submitted successfully',
      submission
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;