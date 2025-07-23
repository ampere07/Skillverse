import express from 'express';
import { requireAuth } from '../middleware/auth';
import { compileCode } from '../controllers/compilerController';

const router = express.Router();

router.post('/java', requireAuth, compileCode);

export default router;