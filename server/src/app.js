import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import listingsRoutes from './routes/listings.routes.js';
import searchRoutes from './routes/search.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Render (and most hosts) sit behind one proxy; needed for correct client IPs.
app.set('trust proxy', 1);

app.use(
  cors({
    origin(origin, cb) {
      const allowed =
        !origin ||
        env.clientOrigins.includes(origin) ||
        (env.nodeEnv !== 'production' &&
          /^http:\/\/localhost:\d+$/.test(origin));
      cb(null, allowed);
    },
  }),
);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/listings', listingsRoutes);
app.use('/api/search', searchRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
