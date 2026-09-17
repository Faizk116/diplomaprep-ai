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
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
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
