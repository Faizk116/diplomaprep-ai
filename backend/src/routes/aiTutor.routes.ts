import { Router } from 'express';
import { AITutorController, chatSchema } from '../controllers/aiTutor.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/ai-tutor/chat', authenticateToken, validateBody(chatSchema), AITutorController.chat);
router.get('/ai-tutor/history', authenticateToken, AITutorController.getHistory);
router.delete('/ai-tutor/reset', authenticateToken, AITutorController.resetHistory);

export default router;
