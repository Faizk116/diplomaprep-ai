import { db } from '../db/database.js';
import { CurriculumService } from './curriculum.service.js';

export class AnalyticsService {
  static getProgress(userId: string) {
    const stats = db.prepare(`
      SELECT streak_days as streakDays, solved_mcqs as solvedMCQs, attempted_mcqs as attemptedMCQs, target_mcqs as targetMCQs, correct_answers as correctAnswers, overall_accuracy as overallAccuracy
      FROM user_stats WHERE user_id = ?
    `).get(userId) as any;

    const subjects = CurriculumService.getSubjects(userId);

    const coveragePercentage = stats && stats.targetMCQs > 0
      ? Math.min(100, Math.round((stats.attemptedMCQs / stats.targetMCQs) * 100))
      : 0;

    const accuracyPercentage = stats ? stats.overallAccuracy : 0;

    return {
      coveragePercentage,
      accuracyPercentage,
      distinctionZone: accuracyPercentage >= 70,
      attemptedMCQs: stats ? stats.attemptedMCQs : 0,
      targetMCQs: stats ? stats.targetMCQs : 1000,
      correctAnswers: stats ? stats.correctAnswers : 0,
      subjectMatrix: subjects.map(s => ({
        code: s.code,
        title: s.title,
        accuracyPercentage: s.accuracyPercentage,
        completedCount: s.completedCount,
        totalMCQs: s.totalMCQs,
      })),
    };
  }

  static getMomentum(userId: string, days = 14) {
    return {
      growthPercentage: 19,
      consecutiveDays: 5,
      projectedScore: 88,
      points: [
        { day: 'Day 1', date: '2026-09-01', accuracy: 62, count: 20 },
        { day: 'Day 4', date: '2026-09-04', accuracy: 71, count: 45 },
        { day: 'Day 8', date: '2026-09-08', accuracy: 76, count: 50 },
        { day: 'Day 11', date: '2026-09-11', accuracy: 80, count: 65 },
        { day: 'Today', date: '2026-09-14', accuracy: 81, count: 35 },
      ],
    };
  }

  static getWeakTopics(userId: string) {
    return [
      {
        id: 'weak-1',
        subjectCode: '22509',
        subjectName: 'Management',
        unitNumber: 2,
        unitName: 'Planning & Decision Making',
        accuracy: 52,
        questionsMissed: 18,
        estimatedMinutes: 8,
        recommendedQuestions: 15,
      },
      {
        id: 'weak-2',
        subjectCode: '22447',
        subjectName: 'Environmental Studies',
        unitNumber: 3,
        unitName: 'Environmental Pollution',
        accuracy: 59,
        questionsMissed: 14,
        estimatedMinutes: 10,
        recommendedQuestions: 20,
      },
      {
        id: 'weak-3',
        subjectCode: '22509',
        subjectName: 'Management',
        unitNumber: 3,
        unitName: 'Organizing & Staffing',
        accuracy: 64,
        questionsMissed: 9,
        estimatedMinutes: 6,
        recommendedQuestions: 10,
      },
    ];
  }
}
