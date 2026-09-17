import { Request, Response, NextFunction } from 'express';
import { SessionsService } from '../services/sessions.service.js';
import { z } from 'zod';

export const startSessionSchema = z.object({
  subjectId: z.string().min(1, 'subjectId is required'),
  unitId: z.number().min(0, 'unitId must be >= 0'),
  questionCount: z.number().min(1).max(100).optional().default(20),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1, 'questionId is required'),
  selectedOption: z.enum(['A', 'B', 'C', 'D']),
  timeSpentSeconds: z.number().min(0).optional().default(0),
});

export const reviewFlagSchema = z.object({
  questionId: z.string().min(1, 'questionId is required'),
  markedForReview: z.boolean(),
});

export const finishSessionSchema = z.object({
  totalTimeSpentSeconds: z.number().min(0).optional().default(0),
});

export class SessionsController {
  static async startSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subjectId, unitId, questionCount } = req.body;
      const userId = req.user?.id || 'demo-pooja';
      const session = SessionsService.startSession(userId, subjectId, unitId, questionCount);
      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.sessionId;
      const { questionId, selectedOption, timeSpentSeconds } = req.body;
      const result = SessionsService.submitAnswer(req.user!.id, sessionId, questionId, selectedOption, timeSpentSeconds);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleReviewFlag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.sessionId;
      const { questionId, markedForReview } = req.body;
      const result = SessionsService.toggleReviewFlag(req.user!.id, sessionId, questionId, markedForReview);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async finishSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.sessionId;
      const { totalTimeSpentSeconds } = req.body;
      const summary = SessionsService.finishSession(req.user!.id, sessionId, totalTimeSpentSeconds || 0);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}
