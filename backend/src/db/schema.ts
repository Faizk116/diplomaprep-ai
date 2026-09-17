export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email_or_enrollment TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  auth_provider TEXT NOT NULL DEFAULT 'email',
  google_id TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT PRIMARY KEY,
  streak_days INTEGER DEFAULT 1,
  solved_mcqs INTEGER DEFAULT 0,
  attempted_mcqs INTEGER DEFAULT 0,
  target_mcqs INTEGER DEFAULT 1000,
  correct_answers INTEGER DEFAULT 0,
  overall_accuracy INTEGER DEFAULT 0,
  weekly_growth INTEGER DEFAULT 0,
  target_exam TEXT DEFAULT 'Summer 2025',
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  branch TEXT NOT NULL,
  scheme TEXT NOT NULL,
  units_count INTEGER NOT NULL,
  total_mcqs INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS units (
  id INTEGER NOT NULL,
  subject_id TEXT NOT NULL,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  weightage_marks INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  topics TEXT NOT NULL, -- JSON array
  PRIMARY KEY (subject_id, id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  unit_id INTEGER NOT NULL,
  unit_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  bloom_level TEXT NOT NULL,
  marks INTEGER NOT NULL DEFAULT 2,
  source_paper TEXT NOT NULL,
  question_text TEXT NOT NULL,
  correct_option TEXT NOT NULL,
  why_correct TEXT NOT NULL,
  trap_warning TEXT NOT NULL,
  exam_tip TEXT NOT NULL,
  peer_accuracy_json TEXT NOT NULL,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id TEXT NOT NULL,
  option_letter TEXT NOT NULL,
  option_text TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  unit_id INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  time_remaining_seconds INTEGER NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS session_answers (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_option TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  marked_for_review INTEGER NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  submitted_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES test_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(user_id, question_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_flags (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  comments TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_chat_threads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject_id TEXT,
  question_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  sender TEXT NOT NULL, -- 'user' | 'tutor'
  message_text TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  suggested_action TEXT,
  FOREIGN KEY (thread_id) REFERENCES ai_chat_threads(id) ON DELETE CASCADE
);
`;
