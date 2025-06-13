const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/auth');
const {
  getDashboard,
  getClasses,
  joinClass,
  getAssignments,
  getAssignment,
  submitAssignment,
  getGrades,
  getSkills
} = require('../controllers/studentController');

// All routes require student role
router.use(requireRole('student'));

router.get('/dashboard', getDashboard);
router.get('/classes', getClasses);
router.post('/classes/join', joinClass);
router.get('/assignments', getAssignments);
router.get('/assignments/:id', getAssignment);
router.post('/submit/:assignmentId', submitAssignment);
router.get('/grades', getGrades);
router.get('/skills', getSkills);

module.exports = router;