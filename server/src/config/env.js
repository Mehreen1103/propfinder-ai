import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// The shared .env lives at the project root. server/.env is also accepted as a
// fallback. dotenv never overwrites a variable that is already set, so the root
// file wins when both exist. In production (Render) the variables come from the
// dashboard instead, and missing files are simply ignored.
for (const rel of ['../../../.env', '../../.env']) {
  dotenv.config({
    path: fileURLToPath(new URL(rel, import.meta.url)),
    quiet: true,
  });
}

export const env = {
  searchRateLimit: Number(process.env.SEARCH_RATE_LIMIT) || 20,
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean),
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  groqTimeoutMs: Number(process.env.GROQ_TIMEOUT_MS) || 8000,
};
