import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/analytics/progress', authenticateToken, AnalyticsController.getProgress);
router.get('/analytics/momentum', authenticateToken, AnalyticsController.getMomentum);
router.get('/analytics/weak-topics', authenticateToken, AnalyticsController.getWeakTopics);

export default router;
