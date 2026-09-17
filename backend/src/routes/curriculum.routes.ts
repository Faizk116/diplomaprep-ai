import { Router } from 'express';
import { CurriculumController } from '../controllers/curriculum.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/subjects', CurriculumController.getSubjects);
router.get('/subjects/:subjectId', CurriculumController.getSubjectById);
router.get('/syllabus/blueprint', CurriculumController.getSyllabusBlueprint);

export default router;
