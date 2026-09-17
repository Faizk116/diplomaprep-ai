import app from './app.js';
import { env } from './config/env.js';

const HOST = process.env.HOST || '0.0.0.0';

app.listen(env.PORT, HOST, () => {
  console.log(`🚀 DiplomaPrep.AI Backend Server listening on http://${HOST}:${env.PORT}`);
  console.log(`   API Endpoint Base: http://${HOST}:${env.PORT}/api/v1`);
});
