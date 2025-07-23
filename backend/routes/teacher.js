const express = require('express');
const User = require('../models/User');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and teacher role
router.use(requireAuth);
router.use(requireRole('teacher'));

// Get teacher dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const teacherId = req.session.userId;
    
    // Get teacher's classes
    const classes = await Class.find({ teacherId }).populate('students', 'name');
    
    // Get assignments from teacher's classes
    const classIds = classes.map(cls => cls._id);
    const assignments = await Assignment.find({ classId: { $in: classIds } });
    
    // Get pending submissions
    const assignmentIds = assignments.map(a => a._id);
    const pendingSubmissions = await Submission.find({ 
      assignmentId: { $in: assignmentIds },
      status: 'pending'
    }).populate('assignmentId', 'title').populate('studentId', 'name').sort({ submittedAt: -1 });
    
    // Calculate total students
    const totalStudents = classes.reduce((sum, cls) => sum + cls.students.length, 0);
    
    res.json({
      classes: classes.length,
      students: totalStudents,
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
      .populate('students', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new class
router.post('/classes', async (req, res) => {
  try {
    const { name, subject, description, theme } = req.body;
    const teacherId = req.session.userId;
    
    if (!name || !subject) {
      return res.status(400).json({ message: 'Name and subject are required' });
    }
    
    const newClass = new Class({
      name,
      subject,
      description: description || '',
      theme: theme || 'blue',
      teacherId
    });
    
    await newClass.save();
    
    res.status(201).json({ 
      message: 'Class created successfully!',
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
    
    // Get teacher's classes
    const classes = await Class.find({ teacherId });
    const classIds = classes.map(cls => cls._id);
    
    // Get assignments from teacher's classes
    const assignments = await Assignment.find({ classId: { $in: classIds } })
      .populate('classId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new assignment
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
    
    if (!classId || !title || !description) {
      return res.status(400).json({ message: 'Class, title, and description are required' });
    }
    
    // Verify teacher owns the class
    const classExists = await Class.findOne({ _id: classId, teacherId });
    if (!classExists) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const assignment = new Assignment({
      classId,
      title,
      description,
      starterCode: starterCode || '',
      language: language || 'javascript',
      difficulty: difficulty || 'beginner',
      skills: skills || [],
      testCases: testCases || [],
      dueDate: new Date(dueDate),
      totalPoints: totalPoints || 100
    });
    
    await assignment.save();
    
    res.status(201).json({ 
      message: 'Assignment created successfully!',
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
    
    // Verify teacher owns the assignment
    const assignment = await Assignment.findById(assignmentId).populate('classId');
    if (!assignment || assignment.classId.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email')
      .populate('assignmentId', 'title totalPoints')
      .sort({ submittedAt: -1 });
    
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
    
    if (grade === undefined || grade < 0 || grade > 100) {
      return res.status(400).json({ message: 'Valid grade (0-100) is required' });
    }
    
    const submission = await Submission.findById(submissionId)
      .populate({
        path: 'assignmentId',
        populate: { path: 'classId' }
      });
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Verify teacher owns the assignment
    if (submission.assignmentId.classId.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    submission.grade = grade;
    submission.teacherFeedback = feedback || '';
    submission.status = 'graded';
    submission.gradedBy = teacherId;
    submission.gradedAt = new Date();
    
    await submission.save();
    
    res.json({ message: 'Submission graded successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;