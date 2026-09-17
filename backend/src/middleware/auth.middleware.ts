import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../db/database.js';
import { User } from '../types/index.js';

export interface JwtPayload {
  userId: string;
  emailOrEnrollment: string;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Access token missing or invalid.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const row = db.prepare(`
      SELECT id, name, email_or_enrollment as emailOrEnrollment, branch, year, avatar_url as avatarUrl, auth_provider as authProvider, created_at as createdAt, updated_at as updatedAt
      FROM users WHERE id = ?
    `).get(decoded.userId) as User | undefined;

    if (!row) {
      res.status(401).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User account associated with token no longer exists.',
      });
      return;
    }

    req.user = row;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Token verification failed or expired.',
    });
  }
}

export function optionalAuthToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const row = db.prepare(`
      SELECT id, name, email_or_enrollment as emailOrEnrollment, branch, year, avatar_url as avatarUrl, auth_provider as authProvider, created_at as createdAt, updated_at as updatedAt
      FROM users WHERE id = ?
    `).get(decoded.userId) as User | undefined;

    if (row) {
      req.user = row;
    }
  } catch (err) {
    // Ignore invalid token for optional auth routes
  }
  next();
}
