import { Router } from 'express';
import authRoutes from './auth.routes.js';
import curriculumRoutes from './curriculum.routes.js';
import questionsRoutes from './questions.routes.js';
import sessionsRoutes from './sessions.routes.js';
import analyticsRoutes from './analytics.routes.js';
import aiTutorRoutes from './aiTutor.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', authRoutes); // /user/me alias
router.use('/', curriculumRoutes);
router.use('/', questionsRoutes);
router.use('/', sessionsRoutes);
router.use('/', analyticsRoutes);
router.use('/', aiTutorRoutes);

export default router;
