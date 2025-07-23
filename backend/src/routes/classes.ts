import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { 
  createClass, 
  joinClass, 
  getClasses, 
  getClass, 
  deleteClass 
} from '../controllers/classController';

const router = express.Router();

router.get('/', requireAuth, getClasses);
router.post('/', requireAuth, requireRole('teacher'), createClass);
router.post('/join', requireAuth, requireRole('student'), joinClass);
router.get('/:id', requireAuth, getClass);
router.delete('/:id', requireAuth, requireRole('teacher'), deleteClass);

export default router;