import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { CREATE_TABLES_SQL } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.isAbsolute(env.DATABASE_PATH)
  ? env.DATABASE_PATH
  : path.resolve(__dirname, '../../', env.DATABASE_PATH);

// Ensure persistent volume directory exists (e.g., /data)
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

// Enable foreign keys and PRAGMAs
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Initialize Schema
export function initDatabase() {
  db.exec(CREATE_TABLES_SQL);

  // Safe migration for google_id column
  const tableInfo = db.prepare(`PRAGMA table_info(users)`).all() as Array<{ name: string }>;
  const hasGoogleId = tableInfo.some(col => col.name === 'google_id');
  if (!hasGoogleId) {
    db.exec(`ALTER TABLE users ADD COLUMN google_id TEXT`);
  }
}
