const express = require('express');
const User = require('../models/User');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and student role
router.use(requireAuth);
router.use(requireRole('student'));

// Get student dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const studentId = req.session.userId;
    
    // Get student's classes
    const classes = await Class.find({ students: studentId }).populate('teacherId', 'name');
    
    // Get assignments from student's classes
    const classIds = classes.map(cls => cls._id);
    const assignments = await Assignment.find({ 
      classId: { $in: classIds },
      isActive: true 
    }).populate('classId', 'name').sort({ dueDate: 1 });
    
    // Get student's submissions
    const submissions = await Submission.find({ studentId }).populate('assignmentId', 'title totalPoints');
    
    // Calculate stats
    const totalAssignments = assignments.length;
    const completedAssignments = submissions.length;
    const averageGrade = submissions.length > 0 
      ? submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) / submissions.length 
      : 0;
    
    // Get due this week
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const dueThisWeek = assignments.filter(assignment => 
      new Date(assignment.dueDate) <= oneWeekFromNow && 
      new Date(assignment.dueDate) >= new Date()
    );
    
    res.json({
      classes: classes.length,
      totalAssignments,
      completedAssignments,
      averageGrade: Math.round(averageGrade),
      dueThisWeek,
      recentGrades: submissions.slice(-5).reverse()
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
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    
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
    
    if (!classCode) {
      return res.status(400).json({ message: 'Class code is required' });
    }
    
    // Find class by code
    const classToJoin = await Class.findOne({ code: classCode.toUpperCase() });
    if (!classToJoin) {
      return res.status(404).json({ message: 'Class not found. Please check the class code.' });
    }
    
    // Check if student is already in the class
    if (classToJoin.students.includes(studentId)) {
      return res.status(400).json({ message: 'You are already enrolled in this class' });
    }
    
    // Add student to class
    classToJoin.students.push(studentId);
    await classToJoin.save();
    
    res.json({ message: 'Successfully joined the class!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student's assignments
router.get('/assignments', async (req, res) => {
  try {
    const studentId = req.session.userId;
    
    // Get student's classes
    const classes = await Class.find({ students: studentId });
    const classIds = classes.map(cls => cls._id);
    
    // Get assignments from student's classes
    const assignments = await Assignment.find({ 
      classId: { $in: classIds },
      isActive: true 
    }).populate('classId', 'name').sort({ dueDate: 1 });
    
    // Get student's submissions for these assignments
    const submissions = await Submission.find({ 
      studentId,
      assignmentId: { $in: assignments.map(a => a._id) }
    });
    
    // Add submission status to assignments
    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = submissions.find(sub => 
        sub.assignmentId.toString() === assignment._id.toString()
      );
      
      let status = 'todo';
      if (submission) {
        status = submission.status === 'graded' ? 'completed' : 'submitted';
      }
      
      return {
        ...assignment.toObject(),
        status,
        submission
      };
    });
    
    res.json(assignmentsWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get specific assignment
router.get('/assignments/:id', async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const studentId = req.session.userId;
    
    const assignment = await Assignment.findById(assignmentId).populate('classId', 'name');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    // Check if student is enrolled in the class
    const studentClass = await Class.findOne({ 
      _id: assignment.classId._id, 
      students: studentId 
    });
    if (!studentClass) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get student's submission if exists
    const submission = await Submission.findOne({ 
      assignmentId, 
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
    
    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }
    
    // Verify assignment exists and student has access
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    const studentClass = await Class.findOne({ 
      _id: assignment.classId, 
      students: studentId 
    });
    if (!studentClass) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if submission already exists
    let submission = await Submission.findOne({ assignmentId, studentId });
    
    if (submission) {
      // Update existing submission
      submission.code = code;
      submission.submittedAt = new Date();
      submission.status = 'pending';
      await submission.save();
    } else {
      // Create new submission
      submission = new Submission({
        assignmentId,
        studentId,
        code,
        language: assignment.language,
        status: 'pending'
      });
      await submission.save();
    }
    
    res.json({ message: 'Assignment submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;