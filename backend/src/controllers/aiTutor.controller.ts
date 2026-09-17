import { Request, Response, NextFunction } from 'express';
import { AITutorService } from '../services/aiTutor.service.js';
import { z } from 'zod';

export const chatSchema = z.object({
  subjectCode: z.string().optional().default('22509'),
  questionId: z.string().optional(),
  message: z.string().min(2, 'Message must be at least 2 characters'),
});

export class AITutorController {
  static async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subjectCode, questionId, message } = req.body;
      const data = AITutorService.chat(req.user!.id, subjectCode, questionId, message);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = AITutorService.getHistory(req.user!.id);
      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = AITutorService.resetHistory(req.user!.id);
      res.status(200).json({
        success: true,
        message: 'AI Tutor chat history reset successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}
