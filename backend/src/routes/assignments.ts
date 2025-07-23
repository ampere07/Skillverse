import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { 
  createAssignment, 
  getAssignments, 
  getAssignment, 
  updateAssignment, 
  deleteAssignment 
} from '../controllers/assignmentController';
import { javaTemplates } from '../templates/javaTemplates';

const router = express.Router();

router.get('/templates', requireAuth, (req, res) => {
  res.json({ templates: javaTemplates });
});

router.post('/classes/:classId', requireAuth, requireRole('teacher'), createAssignment);
router.get('/classes/:classId', requireAuth, getAssignments);
router.get('/:id', requireAuth, getAssignment);
router.put('/:id', requireAuth, requireRole('teacher'), updateAssignment);
router.delete('/:id', requireAuth, requireRole('teacher'), deleteAssignment);

export default router;