import { Router } from 'express';
import { QuestionsController, bookmarkSchema, flagSchema } from '../controllers/questions.controller.js';
import { authenticateToken, optionalAuthToken } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';

const router = Router();

router.get('/questions', optionalAuthToken, QuestionsController.getQuestions);
router.post('/questions/:questionId/bookmark', authenticateToken, validateBody(bookmarkSchema), QuestionsController.toggleBookmark);
router.post('/questions/:questionId/flag', authenticateToken, validateBody(flagSchema), QuestionsController.flagQuestion);

export default router;

