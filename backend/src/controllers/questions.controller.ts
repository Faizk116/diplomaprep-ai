import { Request, Response, NextFunction } from 'express';
import { QuestionsService } from '../services/questions.service.js';
import { z } from 'zod';

export const bookmarkSchema = z.object({
  bookmarked: z.boolean(),
});

export const flagSchema = z.object({
  reason: z.enum(['incorrect_key', 'typo', 'ambiguous', 'out_of_syllabus']),
  comments: z.string().optional(),
});

export class QuestionsController {
  static async getQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = req.query.subjectId as string || 'man-22509';
      const unitId = req.query.unitId ? parseInt(req.query.unitId as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const bloomLevel = req.query.bloomLevel as string | undefined;

      const questions = QuestionsService.getQuestions({ subjectId, unitId, limit, bloomLevel });

      res.status(200).json({
        success: true,
        count: questions.length,
        data: questions,
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleBookmark(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const questionId = req.params.questionId;
      const result = QuestionsService.toggleBookmark(req.user!.id, questionId, req.body.bookmarked);
      res.status(200).json({
        success: true,
        message: result.bookmarked ? 'Question bookmarked successfully.' : 'Bookmark removed.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async flagQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const questionId = req.params.questionId;
      const result = QuestionsService.flagQuestion(req.user!.id, questionId, req.body.reason, req.body.comments);
      res.status(201).json({
        success: true,
        message: 'Report logged for review.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}
