const User = require('../models/User');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const getDashboard = async (req, res) => {
  try {
    const studentId = req.session.user.id;
    
    // Get student's enrolled classes
    const student = await User.findById(studentId).populate('enrolledClasses');
    
    // Get assignments due this week
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const upcomingAssignments = await Assignment.find({
      classId: { $in: student.enrolledClasses.map(c => c._id) },
      dueDate: { $gte: new Date(), $lte: oneWeekFromNow },
      isActive: true
    }).populate('classId').limit(5);

    // Get recent submissions
    const recentSubmissions = await Submission.find({
      studentId,
      status: 'graded'
    }).populate('assignmentId').sort({ gradedAt: -1 }).limit(5);

    // Calculate stats
    const totalSubmissions = await Submission.countDocuments({ studentId });
    const gradedSubmissions = await Submission.countDocuments({ 
      studentId, 
      status: 'graded' 
    });
    
    const averageGrade = gradedSubmissions > 0 
      ? await Submission.aggregate([
          { $match: { studentId: studentId, status: 'graded' } },
          { $group: { _id: null, avgGrade: { $avg: '$grade' } } }
        ])
      : [{ avgGrade: 0 }];

    res.json({
      student: student.toJSON(),
      upcomingAssignments,
      recentGrades: recentSubmissions,
      stats: {
        totalAssignments: totalSubmissions,
        completedAssignments: gradedSubmissions,
        averageGrade: Math.round(averageGrade[0]?.avgGrade || 0),
        streak: 0 // TODO: Implement streak calculation
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};

const getClasses = async (req, res) => {
  try {
    const studentId = req.session.user.id;
    
    const student = await User.findById(studentId).populate({
      path: 'enrolledClasses',
      populate: {
        path: 'teacherId',
        select: 'name'
      }
    });

    // Get assignment counts for each class
    const classesWithStats = await Promise.all(
      student.enrolledClasses.map(async (classObj) => {
        const assignmentCount = await Assignment.countDocuments({
          classId: classObj._id,
          isActive: true
        });

        const nextAssignment = await Assignment.findOne({
          classId: classObj._id,
          dueDate: { $gte: new Date() },
          isActive: true
        }).sort({ dueDate: 1 });

        return {
          ...classObj.toJSON(),
          assignmentCount,
          nextDueDate: nextAssignment?.dueDate
        };
      })
    );

    res.json(classesWithStats);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Failed to load classes' });
  }
};

const joinClass = async (req, res) => {
  try {
    const { classCode } = req.body;
    const studentId = req.session.user.id;

    if (!classCode) {
      return res.status(400).json({ message: 'Class code is required' });
    }

    // Find the class
    const classToJoin = await Class.findOne({ code: classCode.toUpperCase() });
    if (!classToJoin) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if student is already enrolled
    if (classToJoin.students.includes(studentId)) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    // Add student to class
    classToJoin.students.push(studentId);
    await classToJoin.save();

    // Add class to student's enrolled classes
    await User.findByIdAndUpdate(studentId, {
      $addToSet: { enrolledClasses: classToJoin._id }
    });

    res.json({ 
      message: 'Successfully joined class',
      class: classToJoin
    });
  } catch (error) {
    console.error('Join class error:', error);
    res.status(500).json({ message: 'Failed to join class' });
  }
};

const getAssignments = async (req, res) => {
  try {
    const studentId = req.session.user.id;
    const { filter = 'all' } = req.query;

    // Get student's classes
    const student = await User.findById(studentId);
    
    let assignmentQuery = {
      classId: { $in: student.enrolledClasses },
      isActive: true
    };

    // Apply filters
    switch (filter) {
      case 'todo':
        assignmentQuery.dueDate = { $gte: new Date() };
        break;
      case 'completed':
        // Get assignments where student has submitted
        const completedAssignmentIds = await Submission.distinct('assignmentId', {
          studentId,
          status: { $in: ['graded', 'pending'] }
        });
        assignmentQuery._id = { $in: completedAssignmentIds };
        break;
      case 'missing':
        assignmentQuery.dueDate = { $lt: new Date() };
        break;
    }

    const assignments = await Assignment.find(assignmentQuery)
      .populate('classId')
      .sort({ dueDate: 1 });

    // Get submission status for each assignment
    const assignmentsWithStatus = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          assignmentId: assignment._id,
          studentId
        });

        return {
          ...assignment.toJSON(),
          submissionStatus: submission ? submission.status : 'not_submitted',
          grade: submission ? submission.grade : null
        };
      })
    );

    res.json(assignmentsWithStatus);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Failed to load assignments' });
  }
};

const getAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.session.user.id;

    const assignment = await Assignment.findById(id).populate('classId');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student is enrolled in the class
    const student = await User.findById(studentId);
    if (!student.enrolledClasses.includes(assignment.classId._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get existing submission if any
    const submission = await Submission.findOne({
      assignmentId: id,
      studentId
    });

    res.json({
      assignment: assignment.toJSON(),
      submission: submission ? submission.toJSON() : null
    });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Failed to load assignment' });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { code, language } = req.body;
    const studentId = req.session.user.id;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if assignment is still active and not past due
    if (!assignment.isActive) {
      return res.status(400).json({ message: 'Assignment is no longer active' });
    }

    // Find existing submission or create new one
    let submission = await Submission.findOne({
      assignmentId,
      studentId
    });

    if (submission) {
      // Update existing submission
      submission.code = code;
      submission.language = language;
      submission.submittedAt = new Date();
      submission.status = 'pending';
    } else {
      // Create new submission
      submission = new Submission({
        assignmentId,
        studentId,
        code,
        language,
        status: 'pending'
      });
    }

    await submission.save();

    res.json({
      message: 'Assignment submitted successfully',
      submission: submission.toJSON()
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: 'Failed to submit assignment' });
  }
};

const getGrades = async (req, res) => {
  try {
    const studentId = req.session.user.id;

    const submissions = await Submission.find({
      studentId,
      status: 'graded'
    }).populate({
      path: 'assignmentId',
      populate: {
        path: 'classId',
        select: 'name'
      }
    }).sort({ gradedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ message: 'Failed to load grades' });
  }
};

const getSkills = async (req, res) => {
  try {
    const studentId = req.session.user.id;
    
    const student = await User.findById(studentId);
    
    // Get skill progression data from submissions
    const submissions = await Submission.find({
      studentId,
      status: 'graded'
    }).populate('assignmentId');

    // Calculate skill improvements over time
    const skillProgress = {};
    
    Object.keys(student.skillLevels).forEach(skill => {
      skillProgress[skill] = {
        current: student.skillLevels[skill],
        progress: [] // TODO: Implement historical progress tracking
      };
    });

    res.json({
      skillLevels: student.skillLevels,
      skillProgress,
      recommendations: [] // TODO: Implement AI recommendations
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Failed to load skills data' });
  }
};

module.exports = {
  getDashboard,
  getClasses,
  joinClass,
  getAssignments,
  getAssignment,
  submitAssignment,
  getGrades,
  getSkills
};