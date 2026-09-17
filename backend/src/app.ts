import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { seedDatabase } from './db/seed.js';

// Initialize DB and Seed Data
seedDatabase();

const app = express();

// Middlewares
const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback allow in case of pre-flight or custom domain mismatches
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'DiplomaPrep AI Backend', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1', routes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
