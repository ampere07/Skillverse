const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/auth');
const {
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
} = require('../controllers/teacherController');

// All routes require teacher role
router.use(requireRole('teacher'));

router.get('/dashboard', getDashboard);
router.get('/classes', getClasses);
router.post('/classes', createClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);
router.get('/assignments', getAssignments);
router.post('/assignments', createAssignment);
router.get('/submissions/:assignmentId', getSubmissions);
router.post('/grade/:submissionId', gradeSubmission);
router.get('/analytics', getAnalytics);

module.exports = router;