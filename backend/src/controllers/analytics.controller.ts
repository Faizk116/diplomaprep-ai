import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  static async getProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = AnalyticsService.getProgress(req.user!.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMomentum(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 14;
      const data = AnalyticsService.getMomentum(req.user!.id, days);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWeakTopics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = AnalyticsService.getWeakTopics(req.user!.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
