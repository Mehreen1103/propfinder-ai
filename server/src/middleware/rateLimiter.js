import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';

// Protects the free Groq quota from abuse.
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: env.searchRateLimit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many searches, please wait a minute and try again.' },
});
