import express from 'express';
import cors    from 'cors';
import { PORT, CORS_ORIGIN } from './config.js';
import { seedUsers }         from './services/users.js';

import authRouter        from './routes/auth.js';
import adminRouter       from './routes/admin.js';
import studentsRouter    from './routes/students.js';
import academicRouter    from './routes/academic.js';
import supervisorsRouter from './routes/supervisors.js';

const app = express();

// ── Middleware ────────────────────────────────────────────────────────
app.use(cors({
  origin: CORS_ORIGIN.split(',').map(o => o.trim()),
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────
app.use('/api/auth',        authRouter);
app.use('/api/admin',       adminRouter);
app.use('/api/students',    studentsRouter);
app.use('/api/academic',    academicRouter);
app.use('/api/supervisors', supervisorsRouter);

/** Health-check endpoint */
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status  = err.status ?? 500;
  const message = status < 500 ? err.message : 'Internal server error.';
  if (status >= 500) console.error(err);
  res.status(status).json({ message });
});

// ── Start ─────────────────────────────────────────────────────────────
async function start() {
  await seedUsers();
  app.listen(PORT, () => {
    console.log(`ILES backend running on http://localhost:${PORT}`);
    console.log(`  API prefix: /api`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
