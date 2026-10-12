import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`PropFinder API listening on :${env.port}`);
  if (!env.groqApiKey) {
    console.warn('GROQ_API_KEY not set: AI search will fall back to showing all listings.');
  }
});
