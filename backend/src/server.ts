import app from './app.js';
import { env } from './config/env.js';
import { db } from './db/database.js';

const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(env.PORT, HOST, () => {
  console.log(`🚀 DiplomaPrep.AI Backend Server listening on http://${HOST}:${env.PORT}`);
  console.log(`   API Endpoint Base: http://${HOST}:${env.PORT}/api/v1`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    try {
      db.close();
      console.log('SQLite database connection closed successfully.');
    } catch (err) {
      console.error('Error closing SQLite DB:', err);
    }
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
