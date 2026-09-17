import { Router } from 'express';
import { AuthController, signUpSchema, signInSchema, googleAuthSchema } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', validateBody(signUpSchema), AuthController.signUp);
router.post('/signin', validateBody(signInSchema), AuthController.signIn);
router.post('/google', validateBody(googleAuthSchema), AuthController.googleAuth);
router.get('/me', authenticateToken, AuthController.getMe);

export default router;

