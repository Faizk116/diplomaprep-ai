import { db } from '../db/database.js';
import { Subject, Unit } from '../types/index.js';

export class CurriculumService {
  static getSubjects(userId?: string) {
    const subjects = db.prepare(`
      SELECT id, code, title, branch, scheme, units_count as unitsCount, total_mcqs as totalMCQs
      FROM subjects
    `).all() as Subject[];

    return subjects.map((subj) => {
      const unitsRows = db.prepare(`
        SELECT id, subject_id as subjectId, number, title, weightage_marks as weightageMarks, total_questions as totalQuestions, topics
        FROM units WHERE subject_id = ? ORDER BY number ASC
      `).all(subj.id) as Array<Omit<Unit, 'topics'> & { topics: string }>;

      const units = unitsRows.map((u) => {
        let completed = 0;
        let accuracy = 80;

        if (userId) {
          const stats = db.prepare(`
            SELECT COUNT(*) as count, SUM(is_correct) as correct
            FROM session_answers sa
            JOIN questions q ON sa.question_id = q.id
            JOIN test_sessions ts ON sa.session_id = ts.id
            WHERE ts.user_id = ? AND q.subject_id = ? AND q.unit_id = ?
          `).get(userId, subj.id, u.id) as { count: number; correct: number | null };

          if (stats && stats.count > 0) {
            completed = stats.count;
            accuracy = Math.round(((stats.correct || 0) / stats.count) * 100);
          }
        }

        const status = accuracy >= 80 ? 'Strong' : accuracy >= 65 ? 'On Track' : 'Needs Practice';

        return {
          id: u.id,
          number: u.number,
          title: u.title,
          topics: JSON.parse(u.topics),
          totalQuestions: u.totalQuestions,
          completedQuestions: completed,
          masteryPercentage: Math.min(100, Math.round((completed / u.totalQuestions) * 100)),
          accuracyPercentage: accuracy,
          status,
          weightageMarks: u.weightageMarks,
        };
      });

      const totalCompleted = units.reduce((acc, u) => acc + u.completedQuestions, 0);
      const avgAccuracy = units.length > 0
        ? Math.round(units.reduce((acc, u) => acc + u.accuracyPercentage, 0) / units.length)
        : 75;

      return {
        ...subj,
        completedCount: totalCompleted,
        masteredCount: totalCompleted,
        accuracyPercentage: avgAccuracy,
        statusBadge: `${avgAccuracy}% completed`,
        lastActive: 'Recently',
        units,
      };
    });
  }

  static getSubjectById(subjectId: string, userId?: string) {
    const subjects = this.getSubjects(userId);
    const found = subjects.find(s => s.id === subjectId);
    if (!found) {
      const err: any = new Error('Subject ID does not exist.');
      err.statusCode = 404;
      err.code = 'SUBJECT_NOT_FOUND';
      throw err;
    }
    return found;
  }

  static getSyllabusBlueprint() {
    const subjects = db.prepare('SELECT id, code, title FROM subjects').all() as Array<{ id: string; code: string; title: string }>;

    const subjectsWeightage = subjects.map((s) => {
      const units = db.prepare('SELECT number as unitNumber, title, weightage_marks as marks FROM units WHERE subject_id = ? ORDER BY number ASC')
        .all(s.id);
      return {
        code: s.code,
        title: s.title,
        totalWeightage: 70,
        units,
      };
    });

    return {
      scheme: "MSBTE 'I' Scheme",
      examPattern: {
        theoryMarks: 70,
        passingMarks: 28,
        progressiveAssessmentMarks: 30,
        durationMinutes: 120,
      },
      bloomsTaxonomy: {
        remembering: '20-25% (Definitions, Terms, Formulas)',
        understanding: '40-45% (Explanations, Differences, Diagrams)',
        application: '30-35% (Case Studies, Calculations, Fault Diagnosis)',
      },
      subjectsWeightage,
    };
  }
}
