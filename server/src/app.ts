import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { vehiclesRouter } from './routes/vehicles';
import { leadsRouter } from './routes/leads';
import { authRouter } from './routes/auth';
import { adminRouter } from './routes/admin';
import { settingsRouter } from './routes/settings';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const uploadsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/vehicles', vehiclesRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/settings', settingsRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
