import { db } from '../db/database.js';

export class AITutorService {
  static chat(userId: string, subjectCode: string, questionId: string | undefined, message: string) {
    let thread = db.prepare('SELECT id FROM ai_chat_threads WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
      .get(userId) as any;

    if (!thread) {
      const threadId = `th_${Date.now()}`;
      const now = new Date().toISOString();
      db.prepare('INSERT INTO ai_chat_threads (id, user_id, subject_id, question_id, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(threadId, userId, subjectCode, questionId || null, now);
      thread = { id: threadId };
    }

    const userMsgId = `user_${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    db.prepare(`
      INSERT INTO ai_chat_messages (id, thread_id, sender, message_text, timestamp)
      VALUES (?, ?, 'user', ?, ?)
    `).run(userMsgId, thread.id, message, userTimestamp);

    // Contextual AI Response Logic
    let replyText = '';
    const lower = message.toLowerCase();

    if (lower.includes('exam definition') || lower.includes('definition')) {
      replyText = `**Official MSBTE Model Answer Definition:**\n*"Planning is deciding in advance what is to be done, when it is to be done, how it is to be done, and who is to do it."* (Koontz & O'Donnell)\n\n**Key 2-Mark Features:**\n- Goal-oriented\n- Primary function of management\n- Pervasive across all departments\n- Continuous and dynamic`;
    } else if (lower.includes('why is option b wrong') || lower.includes('option b') || lower.includes('wrong')) {
      replyText = `**Why Option B (Gaming) is Incorrect:**\nIn question 7, "Gaming" refers to recreational interactive entertainment. It is not recognized as one of Henry Fayol's 14 principles or 5 primary functions of management (Planning, Organizing, Commanding, Coordinating, Controlling).\n\n**MSBTE Trap Insight:**\nIn multiple choice papers, examiners include everyday distractors to test fundamental conceptual awareness. Always anchor your answers in standard management literature!`;
    } else if (lower.includes('2-mark') || lower.includes('format')) {
      replyText = `**MSBTE 2-Mark Question Format for Unit 2:**\n\n| Parameter | Strategic Planning | Operational Planning |\n|---|---|---|\n| **Time Horizon** | Long-term (3 to 5 years) | Short-term (weeks to 1 year) |\n| **Formulated By** | Top Management | Supervisory Management |\n\n*Full 2 marks awarded if both distinctions are clearly stated with a comparative table!*`;
    } else {
      replyText = `That is an excellent syllabus question for ${subjectCode || 'MSBTE'}!\n\nRemember that:\n1. **Planning & Decision Making** forms the baseline function of management.\n2. Herbert Simon's decision sequence is strictly: **Intelligence -> Design -> Choice**.\n3. Single-use plans (Budgets, Programs) cease once achieved, while Standing plans (Policies, SOPs) govern recurring operations.\n\nWould you like a sample 2-mark question on this topic?`;
    }

    const tutorMsgId = `tutor_${Date.now()}`;
    const tutorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const suggestedAction = 'Generate practice question on Planning Steps';

    db.prepare(`
      INSERT INTO ai_chat_messages (id, thread_id, sender, message_text, timestamp, suggested_action)
      VALUES (?, ?, 'tutor', ?, ?, ?)
    `).run(tutorMsgId, thread.id, replyText, tutorTimestamp, suggestedAction);

    return {
      userMessage: {
        id: userMsgId,
        sender: 'user',
        text: message,
        timestamp: userTimestamp,
      },
      tutorMessage: {
        id: tutorMsgId,
        sender: 'tutor',
        text: replyText,
        timestamp: tutorTimestamp,
        suggestedAction,
      },
    };
  }

  static getHistory(userId: string) {
    const thread = db.prepare('SELECT id FROM ai_chat_threads WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
      .get(userId) as any;

    if (!thread) {
      return [];
    }

    const messages = db.prepare(`
      SELECT id, sender, message_text as text, timestamp, suggested_action as suggestedAction
      FROM ai_chat_messages WHERE thread_id = ? ORDER BY rowid ASC
    `).all(thread.id);

    return messages;
  }

  static resetHistory(userId: string) {
    const threads = db.prepare('SELECT id FROM ai_chat_threads WHERE user_id = ?').all(userId) as any[];
    for (const t of threads) {
      db.prepare('DELETE FROM ai_chat_messages WHERE thread_id = ?').run(t.id);
      db.prepare('DELETE FROM ai_chat_threads WHERE id = ?').run(t.id);
    }
    return { success: true };
  }
}
