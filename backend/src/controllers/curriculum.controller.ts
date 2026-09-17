import { Request, Response, NextFunction } from 'express';
import { CurriculumService } from '../services/curriculum.service.js';

export class CurriculumController {
  static async getSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const subjects = CurriculumService.getSubjects(userId);
      res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSubjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = req.params.subjectId;
      const userId = req.user?.id;
      const subject = CurriculumService.getSubjectById(subjectId, userId);
      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSyllabusBlueprint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blueprint = CurriculumService.getSyllabusBlueprint();
      res.status(200).json({
        success: true,
        data: blueprint,
      });
    } catch (error) {
      next(error);
    }
  }
}
