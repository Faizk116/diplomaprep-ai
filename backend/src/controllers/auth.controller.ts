import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  emailOrEnrollment: z.string().min(3, 'Email or Enrollment number is required'),
  password: z.string().min(4, 'Password must be at least 4 characters').optional(),
  branch: z.enum([
    'Computer / IT Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Electronics & Telecommunication',
  ]),
  year: z.enum(['FY Diploma', 'SY Diploma', 'TY Diploma']),
  authProvider: z.enum(['email', 'google']).optional(),
});

export const signInSchema = z.object({
  emailOrEnrollment: z.string().min(1, 'Email or Enrollment number is required'),
  password: z.string().optional(),
});

export const googleAuthSchema = z.object({
  mode: z.enum(['signin', 'signup']).default('signin'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  googleId: z.string().optional(),
  avatarUrl: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
});

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = AuthService.signUp(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = AuthService.signIn(req.body.emailOrEnrollment, req.body.password);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = AuthService.googleAuth(req.body);
      const statusCode = req.body.mode === 'signup' ? 201 : 200;
      res.status(statusCode).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = AuthService.getUserProfile(req.user!.id);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}

