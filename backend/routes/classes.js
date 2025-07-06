const express = require('express');
const { body, validationResult } = require('express-validator');
const Class = require('../models/Class');
const User = require('../models/User');
const { requireAuth, requireTeacher } = require('../middleware/auth');

const router = express.Router();

// Create class (teacher only)
router.post('/', requireTeacher, [
  body('name').trim().notEmpty(),
  body('description').trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const newClass = new Class({
      name,
      description,
      teacherId: req.session.user.id,
    });

    await newClass.save();

    res.status(201).json({
      message: 'Class created successfully',
      class: newClass,
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's classes
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    let classes;

    if (req.session.user.role === 'teacher') {
      classes = await Class.find({ teacherId: userId })
        .populate('students', 'name email')
        .sort({ createdAt: -1 });
    } else {
      classes = await Class.find({ students: userId })
        .populate('teacherId', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json({ classes });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join class (student only)
router.post('/join', requireAuth, [
  body('joinCode').isLength({ min: 6, max: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { joinCode } = req.body;
    const userId = req.session.user.id;

    if (req.session.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can join classes' });
    }

    const classToJoin = await Class.findOne({ joinCode: joinCode.toUpperCase() });
    if (!classToJoin) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if student is already in the class
    if (classToJoin.students.includes(userId)) {
      return res.status(400).json({ message: 'Already joined this class' });
    }

    // Add student to class
    classToJoin.students.push(userId);
    await classToJoin.save();

    // Populate teacher info
    await classToJoin.populate('teacherId', 'name email');

    res.json({
      message: 'Successfully joined class',
      class: classToJoin,
    });
  } catch (error) {
    console.error('Join class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get class details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const classId = req.params.id;
    const userId = req.session.user.id;

    const classData = await Class.findById(classId)
      .populate('teacherId', 'name email')
      .populate('students', 'name email');

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if user has access to this class
    const hasAccess = classData.teacherId._id.toString() === userId || 
                     classData.students.some(student => student._id.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ class: classData });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;