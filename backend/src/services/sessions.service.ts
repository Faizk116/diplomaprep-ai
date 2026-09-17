import { db } from '../db/database.js';
import { QuestionsService } from './questions.service.js';
import { Question } from '../types/index.js';

export class SessionsService {
  static startSession(userId: string, subjectId: string, unitId: number, questionCount: number) {
    const questions = QuestionsService.getQuestions({
      subjectId,
      unitId,
      limit: questionCount,
    });

    if (questions.length === 0) {
      const err: any = new Error('No questions found matching criteria.');
      err.statusCode = 404;
      err.code = 'NO_QUESTIONS_FOUND';
      throw err;
    }

    const sessionId = `sess_${Date.now()}`;
    const timeRemainingSeconds = questionCount * 45; // 45s per question
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO test_sessions (id, user_id, subject_id, unit_id, total_questions, score, status, time_remaining_seconds, started_at)
      VALUES (?, ?, ?, ?, ?, 0, 'in_progress', ?, ?)
    `).run(sessionId, userId, subjectId, unitId, questions.length, timeRemainingSeconds, now);

    return {
      sessionId,
      subjectId,
      unitId,
      timeRemainingSeconds,
      totalQuestions: questions.length,
      questions,
    };
  }

  static submitAnswer(
    userId: string,
    sessionId: string,
    questionId: string,
    selectedOption: 'A' | 'B' | 'C' | 'D',
    timeSpentSeconds: number
  ) {
    const session = db.prepare('SELECT * FROM test_sessions WHERE id = ? AND user_id = ?').get(sessionId, userId) as any;
    if (!session) {
      const err: any = new Error('Session not found or not owned by user.');
      err.statusCode = 404;
      err.code = 'SESSION_NOT_FOUND';
      throw err;
    }

    const question = QuestionsService.getQuestions({ subjectId: session.subject_id, limit: 100 })
      .find(q => q.id === questionId);

    if (!question) {
      const err: any = new Error('Question not found.');
      err.statusCode = 404;
      err.code = 'QUESTION_NOT_FOUND';
      throw err;
    }

    const isCorrect = selectedOption === question.correctOption;
    const answerId = `ans_${Date.now()}_${questionId}`;
    const now = new Date().toISOString();

    // Upsert session answer
    const existingAns = db.prepare('SELECT id FROM session_answers WHERE session_id = ? AND question_id = ?')
      .get(sessionId, questionId) as any;

    if (existingAns) {
      db.prepare(`
        UPDATE session_answers
        SET selected_option = ?, is_correct = ?, time_spent_seconds = ?, submitted_at = ?
        WHERE id = ?
      `).run(selectedOption, isCorrect ? 1 : 0, timeSpentSeconds, now, existingAns.id);
    } else {
      db.prepare(`
        INSERT INTO session_answers (id, session_id, question_id, selected_option, is_correct, marked_for_review, time_spent_seconds, submitted_at)
        VALUES (?, ?, ?, ?, ?, 0, ?, ?)
      `).run(answerId, sessionId, questionId, selectedOption, isCorrect ? 1 : 0, timeSpentSeconds, now);
    }

    // Update user_stats
    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(userId) as any;
    if (stats) {
      const newAttempted = stats.attempted_mcqs + 1;
      const newCorrect = isCorrect ? stats.correct_answers + 1 : stats.correct_answers;
      const newSolved = stats.solved_mcqs + 1;
      const newAccuracy = Math.round((newCorrect / newAttempted) * 100);

      db.prepare(`
        UPDATE user_stats
        SET attempted_mcqs = ?, correct_answers = ?, solved_mcqs = ?, overall_accuracy = ?, updated_at = ?
        WHERE user_id = ?
      `).run(newAttempted, newCorrect, newSolved, newAccuracy, now, userId);
    }

    const updatedStats = db.prepare(`
      SELECT user_id as userId, streak_days as streakDays, solved_mcqs as solvedMCQs, attempted_mcqs as attemptedMCQs, target_mcqs as targetMCQs, correct_answers as correctAnswers, overall_accuracy as overallAccuracy, weekly_growth as weeklyGrowth, target_exam as targetExam
      FROM user_stats WHERE user_id = ?
    `).get(userId);

    return {
      questionId,
      selectedOption,
      correctOption: question.correctOption,
      isCorrect,
      marksAwarded: isCorrect ? question.marks : 0,
      explanation: question.explanation,
      updatedUserStats: updatedStats,
    };
  }

  static toggleReviewFlag(userId: string, sessionId: string, questionId: string, markedForReview: boolean) {
    const session = db.prepare('SELECT id FROM test_sessions WHERE id = ? AND user_id = ?').get(sessionId, userId);
    if (!session) {
      const err: any = new Error('Session not found.');
      err.statusCode = 404;
      err.code = 'SESSION_NOT_FOUND';
      throw err;
    }

    const answer = db.prepare('SELECT id FROM session_answers WHERE session_id = ? AND question_id = ?')
      .get(sessionId, questionId) as any;

    if (answer) {
      db.prepare('UPDATE session_answers SET marked_for_review = ? WHERE id = ?')
        .run(markedForReview ? 1 : 0, answer.id);
    } else {
      db.prepare(`
        INSERT INTO session_answers (id, session_id, question_id, selected_option, is_correct, marked_for_review, time_spent_seconds, submitted_at)
        VALUES (?, ?, ?, 'A', 0, ?, 0, ?)
      `).run(`ans_${Date.now()}`, sessionId, questionId, markedForReview ? 1 : 0, new Date().toISOString());
    }

    return { questionId, markedForReview };
  }

  static finishSession(userId: string, sessionId: string, totalTimeSpentSeconds: number) {
    const session = db.prepare('SELECT * FROM test_sessions WHERE id = ? AND user_id = ?').get(sessionId, userId) as any;
    if (!session) {
      const err: any = new Error('Session not found.');
      err.statusCode = 404;
      err.code = 'SESSION_NOT_FOUND';
      throw err;
    }

    const answers = db.prepare(`
      SELECT question_id as questionId, selected_option as selectedOption, is_correct as isCorrect
      FROM session_answers WHERE session_id = ?
    `).all(sessionId) as any[];

    const correctCount = answers.filter(a => a.isCorrect === 1).length;
    const totalCount = session.total_questions;
    const accuracyPct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const grade = accuracyPct >= 75 ? 'Passed with Distinction' : accuracyPct >= 40 ? 'Passed' : 'Needs Improvement';
    const mins = Math.floor(totalTimeSpentSeconds / 60);
    const secs = totalTimeSpentSeconds % 60;
    const timeSpent = `${mins}m ${secs}s`;
    const avgSpeed = totalCount > 0 ? `${Math.round(totalTimeSpentSeconds / totalCount)}s/q` : '0s/q';

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE test_sessions
      SET score = ?, status = 'completed', completed_at = ?
      WHERE id = ?
    `).run(correctCount, now, sessionId);

    const questionResults = answers.map((a, i) => ({
      questionId: a.questionId,
      num: i + 1,
      isCorrect: a.isCorrect === 1,
    }));

    return {
      sessionId,
      score: correctCount,
      total: totalCount,
      accuracyPercentage: accuracyPct,
      grade,
      timeSpent,
      avgSpeedPerQuestion: avgSpeed,
      boardPercentileRank: accuracyPct >= 80 ? 'Top 12%' : 'Top 25%',
      projectedBoardGrade: accuracyPct >= 80 ? 'O Grade (>85%)' : 'A Grade (>70%)',
      aiRecommendation: 'Review weak subtopics and distinction questions between Strategic vs Operational plans.',
      questionResults,
    };
  }
}
