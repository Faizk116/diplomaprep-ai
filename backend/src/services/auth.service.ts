import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { env } from '../config/env.js';
import { User, UserStats } from '../types/index.js';

export class AuthService {
  static signUp(data: {
    name: string;
    emailOrEnrollment: string;
    password?: string;
    branch: string;
    year: string;
    authProvider?: 'email' | 'google';
  }) {
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email_or_enrollment) = LOWER(?)')
      .get(data.emailOrEnrollment);

    if (existing) {
      const err: any = new Error('An account with this email/enrollment already exists.');
      err.statusCode = 409;
      err.code = 'ACCOUNT_EXISTS';
      throw err;
    }

    const userId = `acc_${Date.now()}`;
    const passwordHash = data.password ? bcrypt.hashSync(data.password, 10) : undefined;
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=2563eb&textColor=ffffff`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, email_or_enrollment, password_hash, branch, year, auth_provider, avatar_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      data.name,
      data.emailOrEnrollment,
      passwordHash || null,
      data.branch,
      data.year,
      data.authProvider || 'email',
      avatarUrl,
      now,
      now
    );

    db.prepare(`
      INSERT INTO user_stats (user_id, streak_days, solved_mcqs, attempted_mcqs, target_mcqs, correct_answers, overall_accuracy, weekly_growth, target_exam, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, 1, 0, 0, 1000, 0, 0, 0, 'Summer 2025', now);

    const token = jwt.sign({ userId, emailOrEnrollment: data.emailOrEnrollment }, env.JWT_SECRET, { expiresIn: '7d' });

    const user: User = {
      id: userId,
      name: data.name,
      emailOrEnrollment: data.emailOrEnrollment,
      branch: data.branch,
      year: data.year,
      avatarUrl,
      authProvider: data.authProvider || 'email',
      createdAt: now,
      updatedAt: now,
    };

    const userStats: UserStats = {
      userId,
      streakDays: 1,
      solvedMCQs: 0,
      attemptedMCQs: 0,
      targetMCQs: 1000,
      correctAnswers: 0,
      overallAccuracy: 0,
      weeklyGrowth: 0,
      targetExam: 'Summer 2025',
    };

    return { token, user, userStats };
  }

  static signIn(emailOrEnrollment: string, password?: string) {
    const row = db.prepare(`
      SELECT id, name, email_or_enrollment as emailOrEnrollment, password_hash as passwordHash, branch, year, avatar_url as avatarUrl, auth_provider as authProvider, created_at as createdAt, updated_at as updatedAt
      FROM users WHERE LOWER(email_or_enrollment) = LOWER(?)
    `).get(emailOrEnrollment) as (User & { passwordHash?: string }) | undefined;

    if (!row) {
      const err: any = new Error('No account found matching this enrollment ID.');
      err.statusCode = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    if (row.passwordHash && password) {
      const isValid = bcrypt.compareSync(password, row.passwordHash);
      if (!isValid) {
        const err: any = new Error('Invalid email/enrollment or password.');
        err.statusCode = 401;
        err.code = 'INVALID_CREDENTIALS';
        throw err;
      }
    }

    const token = jwt.sign({ userId: row.id, emailOrEnrollment: row.emailOrEnrollment }, env.JWT_SECRET, { expiresIn: '7d' });

    const statsRow = db.prepare(`
      SELECT user_id as userId, streak_days as streakDays, solved_mcqs as solvedMCQs, attempted_mcqs as attemptedMCQs, target_mcqs as targetMCQs, correct_answers as correctAnswers, overall_accuracy as overallAccuracy, weekly_growth as weeklyGrowth, target_exam as targetExam
      FROM user_stats WHERE user_id = ?
    `).get(row.id) as UserStats;

    const { passwordHash, ...user } = row;

    return { token, user, userStats: statsRow };
  }

  static getUserProfile(userId: string) {
    const user = db.prepare(`
      SELECT id, name, email_or_enrollment as emailOrEnrollment, google_id as googleId, branch, year, avatar_url as avatarUrl, auth_provider as authProvider, created_at as createdAt, updated_at as updatedAt
      FROM users WHERE id = ?
    `).get(userId) as User | undefined;

    if (!user) {
      const err: any = new Error('User not found');
      err.statusCode = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    const stats = db.prepare(`
      SELECT user_id as userId, streak_days as streakDays, solved_mcqs as solvedMCQs, attempted_mcqs as attemptedMCQs, target_mcqs as targetMCQs, correct_answers as correctAnswers, overall_accuracy as overallAccuracy, weekly_growth as weeklyGrowth, target_exam as targetExam
      FROM user_stats WHERE user_id = ?
    `).get(userId) as UserStats;

    return { ...user, userStats: stats };
  }

  static googleAuth(data: {
    mode: 'signin' | 'signup';
    email: string;
    name: string;
    googleId?: string;
    avatarUrl?: string;
    branch?: string;
    year?: string;
  }) {
    const existing = db.prepare(`
      SELECT id, name, email_or_enrollment as emailOrEnrollment, password_hash as passwordHash, google_id as googleId, branch, year, avatar_url as avatarUrl, auth_provider as authProvider, created_at as createdAt, updated_at as updatedAt
      FROM users WHERE LOWER(email_or_enrollment) = LOWER(?) OR (google_id IS NOT NULL AND google_id = ?)
    `).get(data.email, data.googleId || '') as (User & { passwordHash?: string }) | undefined;

    if (data.mode === 'signin') {
      if (!existing) {
        const err: any = new Error('No account found with this Google email. Please sign up first.');
        err.statusCode = 404;
        err.code = 'ACCOUNT_NOT_FOUND';
        throw err;
      }

      if (data.googleId && !existing.googleId) {
        db.prepare('UPDATE users SET google_id = ?, auth_provider = ?, updated_at = ? WHERE id = ?')
          .run(data.googleId, 'google', new Date().toISOString(), existing.id);
        existing.googleId = data.googleId;
      }

      const token = jwt.sign({ userId: existing.id, emailOrEnrollment: existing.emailOrEnrollment }, env.JWT_SECRET, { expiresIn: '7d' });

      const statsRow = db.prepare(`
        SELECT user_id as userId, streak_days as streakDays, solved_mcqs as solvedMCQs, attempted_mcqs as attemptedMCQs, target_mcqs as targetMCQs, correct_answers as correctAnswers, overall_accuracy as overallAccuracy, weekly_growth as weeklyGrowth, target_exam as targetExam
        FROM user_stats WHERE user_id = ?
      `).get(existing.id) as UserStats;

      const { passwordHash, ...user } = existing;
      return { token, user, userStats: statsRow };
    }

    // mode === 'signup'
    if (existing) {
      const token = jwt.sign({ userId: existing.id, emailOrEnrollment: existing.emailOrEnrollment }, env.JWT_SECRET, { expiresIn: '7d' });
      const statsRow = db.prepare(`
        SELECT user_id as userId, streak_days as streakDays, solved_mcqs as solvedMCQs, attempted_mcqs as attemptedMCQs, target_mcqs as targetMCQs, correct_answers as correctAnswers, overall_accuracy as overallAccuracy, weekly_growth as weeklyGrowth, target_exam as targetExam
        FROM user_stats WHERE user_id = ?
      `).get(existing.id) as UserStats;

      const { passwordHash, ...user } = existing;
      return { token, user, userStats: statsRow };
    }

    const userId = `acc_${Date.now()}`;
    const avatarUrl = data.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=2563eb&textColor=ffffff`;
    const branch = data.branch || 'Computer / IT Engineering';
    const year = data.year || 'TY Diploma';
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, email_or_enrollment, password_hash, branch, year, auth_provider, google_id, avatar_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      data.name,
      data.email,
      null,
      branch,
      year,
      'google',
      data.googleId || null,
      avatarUrl,
      now,
      now
    );

    db.prepare(`
      INSERT INTO user_stats (user_id, streak_days, solved_mcqs, attempted_mcqs, target_mcqs, correct_answers, overall_accuracy, weekly_growth, target_exam, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, 1, 0, 0, 1000, 0, 0, 0, 'Summer 2025', now);

    const token = jwt.sign({ userId, emailOrEnrollment: data.email }, env.JWT_SECRET, { expiresIn: '7d' });

    const user: User = {
      id: userId,
      name: data.name,
      emailOrEnrollment: data.email,
      googleId: data.googleId,
      branch,
      year,
      avatarUrl,
      authProvider: 'google',
      createdAt: now,
      updatedAt: now,
    };

    const userStats: UserStats = {
      userId,
      streakDays: 1,
      solvedMCQs: 0,
      attemptedMCQs: 0,
      targetMCQs: 1000,
      correctAnswers: 0,
      overallAccuracy: 0,
      weeklyGrowth: 0,
      targetExam: 'Summer 2025',
    };

    return { token, user, userStats };
  }
}

