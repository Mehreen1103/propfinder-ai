import { Router } from 'express';
import { aiSearch } from '../controllers/search.controller.js';
import { searchLimiter } from '../middleware/rateLimiter.js';

const router = Router();
router.post('/ai', searchLimiter, aiSearch);

export default router;
