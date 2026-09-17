import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'diplomaprep_super_secret_jwt_key_2026',
  DATABASE_PATH: process.env.DATABASE_PATH || 'database.sqlite',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
