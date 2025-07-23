import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { 
  submitAssignment, 
  getSubmissions, 
  getStudentSubmission, 
  gradeSubmission 
} from '../controllers/submissionController';

const router = express.Router();

router.post('/assignments/:id', requireAuth, requireRole('student'), submitAssignment);
router.get('/assignments/:id', requireAuth, requireRole('teacher'), getSubmissions);
router.get('/assignments/:id/student', requireAuth, requireRole('student'), getStudentSubmission);
router.put('/:id/grade', requireAuth, requireRole('teacher'), gradeSubmission);

export default router;