const User = require('../models/User');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const getDashboard = async (req, res) => {
  try {
    const teacherId = req.session.user.id;

    // Get teacher's classes
    const classes = await Class.find({ teacherId }).populate('students');

    // Get pending submissions
    const classIds = classes.map(c => c._id);
    const pendingSubmissions = await Submission.find({
      assignmentId: { $in: await Assignment.distinct('_id', { classId: { $in: classIds } }) },
      status: 'pending'
    }).populate('assignmentId studentId').limit(10);

    // Get recent activity
    const recentActivity = await Submission.find({
      assignmentId: { $in: await Assignment.distinct('_id', { classId: { $in: classIds } }) }
    }).populate('assignmentId studentId').sort({ submittedAt: -1 }).limit(10);

    // Calculate stats
    const totalStudents = classes.reduce((sum, cls) => sum + cls.students.length, 0);
    const totalAssignments = await Assignment.countDocuments({ classId: { $in: classIds } });

    res.json({
      classes: classes.length,
      totalStudents,
      totalAssignments,
      pendingSubmissions,
      recentActivity
    });
  } catch (error) {
    console.error('Teacher dashboard error:', error);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};

const getClasses = async (req, res) => {
  try {
    const teacherId = req.session.user.id;

    const classes = await Class.find({ teacherId }).populate('students', 'name email');

    // Get assignment counts for each class
    const classesWithStats = await Promise.all(
      classes.map(async (classObj) => {
        const assignmentCount = await Assignment.countDocuments({
          classId: classObj._id,
          isActive: true
        });

        return {
          ...classObj.toJSON(),
          assignmentCount
        };
      })
    );

    res.json(classesWithStats);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Failed to load classes' });
  }
};

const createClass = async (req, res) => {
  try {
    const { name, subject, description, theme } = req.body;
    const teacherId = req.session.user.id;

    if (!name || !subject) {
      return res.status(400).json({ message: 'Name and subject are required' });
    }

    // Generate unique class code
    const code = await Class.generateClassCode();

    const newClass = new Class({
      name,
      subject,
      description,
      theme: theme || 'blue',
      teacherId,
      code
    });

    await newClass.save();

    res.status(201).json({
      message: 'Class created successfully',
      class: newClass.toJSON()
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Failed to create class' });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, description, theme } = req.body;
    const teacherId = req.session.user.id;

    const classToUpdate = await Class.findOne({ _id: id, teacherId });
    if (!classToUpdate) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Update fields
    if (name) classToUpdate.name = name;
    if (subject) classToUpdate.subject = subject;
    if (description !== undefined) classToUpdate.description = description;
    if (theme) classToUpdate.theme = theme;

    await classToUpdate.save();

    res.json({
      message: 'Class updated successfully',
      class: classToUpdate.toJSON()
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Failed to update class' });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.session.user.id;

    const classToDelete = await Class.findOne({ _id: id, teacherId });
    if (!classToDelete) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Archive class instead of deleting
    classToDelete.isActive = false;
    await classToDelete.save();

    res.json({ message: 'Class archived successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Failed to archive class' });
  }
};

const getAssignments = async (req, res) => {
  try {
    const teacherId = req.session.user.id;

    // Get teacher's classes
    const classes = await Class.find({ teacherId });
    const classIds = classes.map(c => c._id);

    const assignments = await Assignment.find({ classId: { $in: classIds } })
      .populate('classId')
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Failed to load assignments' });
  }
};

const createAssignment = async (req, res) => {
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
    const teacherId = req.session.user.id;

    // Validate required fields
    if (!classId || !title || !description || !language || !difficulty || !dueDate || !totalPoints) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Verify teacher owns the class
    const classExists = await Class.findOne({ _id: classId, teacherId });
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const assignment = new Assignment({
      classId,
      title,
      description,
      starterCode: starterCode || '',
      language,
      difficulty,
      skills: skills || [],
      testCases: testCases || [],
      dueDate: new Date(dueDate),
      totalPoints,
      createdBy: teacherId
    });

    await assignment.save();

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment: assignment.toJSON()
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const teacherId = req.session.user.id;

    // Verify teacher owns the assignment's class
    const assignment = await Assignment.findById(assignmentId).populate('classId');
    if (!assignment || assignment.classId.teacherId.toString() !== teacherId) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      assignment: assignment.toJSON(),
      submissions
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Failed to load submissions' });
  }
};

const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    const teacherId = req.session.user.id;

    if (grade === undefined || grade < 0 || grade > 100) {
      return res.status(400).json({ message: 'Grade must be between 0 and 100' });
    }

    const submission = await Submission.findById(submissionId)
      .populate({
        path: 'assignmentId',
        populate: {
          path: 'classId'
        }
      });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify teacher owns the class
    if (submission.assignmentId.classId.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update submission
    submission.grade = grade;
    submission.teacherFeedback = feedback || '';
    submission.status = 'graded';
    submission.gradedBy = teacherId;
    submission.gradedAt = new Date();

    await submission.save();

    res.json({
      message: 'Submission graded successfully',
      submission: submission.toJSON()
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ message: 'Failed to grade submission' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const teacherId = req.session.user.id;

    // Get teacher's classes
    const classes = await Class.find({ teacherId }).populate('students');
    const classIds = classes.map(c => c._id);

    // Get all assignments
    const assignments = await Assignment.find({ classId: { $in: classIds } });

    // Get all submissions
    const submissions = await Submission.find({
      assignmentId: { $in: assignments.map(a => a._id) }
    }).populate('studentId assignmentId');

    // Calculate analytics
    const analytics = {
      classPerformance: classes.map(cls => ({
        classId: cls._id,
        className: cls.name,
        studentCount: cls.students.length,
        assignmentCount: assignments.filter(a => a.classId.toString() === cls._id.toString()).length,
        averageGrade: 0 // TODO: Calculate average grade for class
      })),
      topPerformers: [], // TODO: Calculate top performing students
      skillDistribution: {}, // TODO: Calculate skill level distribution
      submissionTrends: [] // TODO: Calculate submission trends over time
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to load analytics' });
  }
};

module.exports = {
  getDashboard,
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getAssignments,
  createAssignment,
  getSubmissions,
  gradeSubmission,
  getAnalytics
};