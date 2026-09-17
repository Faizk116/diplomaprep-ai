import { db } from '../db/database.js';
import { Question, QuestionOption } from '../types/index.js';

export class QuestionsService {
  static getQuestions(filter: {
    subjectId: string;
    unitId?: number;
    limit?: number;
    bloomLevel?: string;
  }): Question[] {
    let query = `
      SELECT id, code, subject_id as subjectId, unit_id as unitId, unit_name as unitName, topic, bloom_level as bloomLevel, marks, source_paper as sourcePaper, question_text as question, correct_option as correctOption, why_correct as whyCorrect, trap_warning as trapWarning, exam_tip as examTip, peer_accuracy_json as peerAccuracyJson
      FROM questions
      WHERE subject_id = ?
    `;
    const params: any[] = [filter.subjectId];

    if (filter.unitId !== undefined && filter.unitId !== 0) {
      query += ` AND unit_id = ?`;
      params.push(filter.unitId);
    }

    if (filter.bloomLevel) {
      query += ` AND bloom_level LIKE ?`;
      params.push(`%${filter.bloomLevel}%`);
    }

    const limit = filter.limit && filter.limit > 0 ? filter.limit : 20;
    query += ` LIMIT ?`;
    params.push(limit);

    const rows = db.prepare(query).all(...params) as any[];

    return rows.map((row) => {
      const optionsRows = db.prepare(`
        SELECT option_letter as id, option_text as text, description
        FROM question_options WHERE question_id = ? ORDER BY option_letter ASC
      `).all(row.id) as QuestionOption[];

      const peerAccuracy = JSON.parse(row.peerAccuracyJson);

      return {
        id: row.id,
        code: row.code,
        subjectId: row.subjectId,
        unitId: row.unitId,
        unitName: row.unitName,
        topic: row.topic,
        bloomLevel: row.bloomLevel,
        marks: row.marks,
        sourcePaper: row.sourcePaper,
        question: row.question,
        options: optionsRows,
        correctOption: row.correctOption,
        explanation: {
          whyCorrect: row.whyCorrect,
          trapWarning: row.trapWarning,
          examTip: row.examTip,
          peerAccuracy,
        },
      };
    });
  }

  static toggleBookmark(userId: string, questionId: string, bookmarked: boolean) {
    const qExists = db.prepare('SELECT id FROM questions WHERE id = ?').get(questionId);
    if (!qExists) {
      const err: any = new Error('Question not found.');
      err.statusCode = 404;
      err.code = 'QUESTION_NOT_FOUND';
      throw err;
    }

    if (bookmarked) {
      db.prepare(`
        INSERT OR IGNORE INTO user_bookmarks (id, user_id, question_id, created_at)
        VALUES (?, ?, ?, ?)
      `).run(`bm_${Date.now()}`, userId, questionId, new Date().toISOString());
    } else {
      db.prepare('DELETE FROM user_bookmarks WHERE user_id = ? AND question_id = ?')
        .run(userId, questionId);
    }

    return { questionId, bookmarked };
  }

  static flagQuestion(userId: string, questionId: string, reason: string, comments?: string) {
    const qExists = db.prepare('SELECT id FROM questions WHERE id = ?').get(questionId);
    if (!qExists) {
      const err: any = new Error('Question not found.');
      err.statusCode = 404;
      err.code = 'QUESTION_NOT_FOUND';
      throw err;
    }

    const flagId = `flag_${Date.now()}`;
    db.prepare(`
      INSERT INTO question_flags (id, user_id, question_id, reason, comments, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(flagId, userId, questionId, reason, comments || null, new Date().toISOString());

    return { flagId, questionId };
  }
}
