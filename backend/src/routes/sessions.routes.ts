import { Router } from 'express';
import {
  SessionsController,
  startSessionSchema,
  submitAnswerSchema,
  reviewFlagSchema,
  finishSessionSchema,
} from '../controllers/sessions.controller.js';
import { authenticateToken, optionalAuthToken } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/sessions/start', optionalAuthToken, validateBody(startSessionSchema), SessionsController.startSession);

router.post('/sessions/:sessionId/answers', authenticateToken, validateBody(submitAnswerSchema), SessionsController.submitAnswer);
router.patch('/sessions/:sessionId/review-flag', authenticateToken, validateBody(reviewFlagSchema), SessionsController.toggleReviewFlag);
router.post('/sessions/:sessionId/finish', authenticateToken, validateBody(finishSessionSchema), SessionsController.finishSession);

export default router;
