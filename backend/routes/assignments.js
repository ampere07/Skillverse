const express = require('express');
const { body, validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const { requireAuth, requireTeacher } = require('../middleware/auth');

const router = express.Router();

// Create assignment (teacher only)
router.post('/', requireTeacher, [
  body('classId').isMongoId(),
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('language').isIn(['python', 'java', 'cpp', 'javascript']),
  body('dueDate').isISO8601(),
  body('totalPoints').isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { classId, title, description, language, starterCode, testCases, dueDate, totalPoints } = req.body;

    // Verify teacher owns the class
    const classData = await Class.findById(classId);
    if (!classData || classData.teacherId.toString() !== req.session.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignment = new Assignment({
      classId,
      title,
      description,
      language,
      starterCode: starterCode || '',
      testCases: testCases || [],
      dueDate: new Date(dueDate),
      totalPoints,
    });

    await assignment.save();

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment,
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assignments for a class
router.get('/class/:classId', requireAuth, async (req, res) => {
  try {
    const classId = req.params.classId;
    const userId = req.session.user.id;

    // Verify user has access to this class
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const hasAccess = classData.teacherId.toString() === userId || 
                     classData.students.includes(userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignments = await Assignment.find({ classId })
      .sort({ createdAt: -1 });

    res.json({ assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific assignment
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const userId = req.session.user.id;

    const assignment = await Assignment.findById(assignmentId)
      .populate('classId', 'name teacherId students');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check access
    const hasAccess = assignment.classId.teacherId.toString() === userId || 
                     assignment.classId.students.includes(userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ assignment });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update assignment (teacher only)
router.put('/:id', requireTeacher, [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('language').optional().isIn(['python', 'java', 'cpp', 'javascript']),
  body('dueDate').optional().isISO8601(),
  body('totalPoints').optional().isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const assignmentId = req.params.id;
    const userId = req.session.user.id;

    const assignment = await Assignment.findById(assignmentId)
      .populate('classId', 'teacherId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify teacher owns the class
    if (assignment.classId.teacherId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        assignment[key] = req.body[key];
      }
    });

    await assignment.save();

    res.json({
      message: 'Assignment updated successfully',
      assignment,
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;