import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate }    from '../middleware/validate.js';
import { logSchema, timesheetSchema } from '../schemas/students.js';
import * as logsService       from '../services/logs.js';
import * as timesheetsService from '../services/timesheets.js';

const router = Router();

/**
 * Guard: only the student themselves OR academic/admin may access a student's data.
 */
function canAccessStudent(req, res, next) {
  const { user } = req;
  const { username } = req.params;
  if (user.username === username || user.role === 'academic' || user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied.' });
}

// ── Logs ──────────────────────────────────────────────────────────────

/** GET /api/students/:username/logs */
router.get('/:username/logs', requireAuth, canAccessStudent, async (req, res, next) => {
  try {
    res.json(await logsService.getLogs(req.params.username));
  } catch (err) {
    next(err);
  }
});

/** POST /api/students/:username/logs */
router.post('/:username/logs', requireAuth, requireRole('student'), canAccessStudent, validate(logSchema), async (req, res, next) => {
  try {
    const log = await logsService.createLog(req.params.username, req.body);
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
});

/** PUT /api/students/:username/logs/:id */
router.put('/:username/logs/:id', requireAuth, requireRole('student'), canAccessStudent, validate(logSchema), async (req, res, next) => {
  try {
    const log = await logsService.updateLog(req.params.username, req.params.id, req.body);
    res.json(log);
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/students/:username/logs/:id */
router.delete('/:username/logs/:id', requireAuth, requireRole('student'), canAccessStudent, async (req, res, next) => {
  try {
    await logsService.deleteLog(req.params.username, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ── Timesheets ────────────────────────────────────────────────────────

/** GET /api/students/:username/timesheets */
router.get('/:username/timesheets', requireAuth, canAccessStudent, async (req, res, next) => {
  try {
    res.json(await timesheetsService.getTimesheets(req.params.username));
  } catch (err) {
    next(err);
  }
});

/** POST /api/students/:username/timesheets */
router.post('/:username/timesheets', requireAuth, requireRole('student'), canAccessStudent, validate(timesheetSchema), async (req, res, next) => {
  try {
    const entry = await timesheetsService.createTimesheet(req.params.username, req.body);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

/** PUT /api/students/:username/timesheets/:id */
router.put('/:username/timesheets/:id', requireAuth, requireRole('student'), canAccessStudent, validate(timesheetSchema), async (req, res, next) => {
  try {
    const entry = await timesheetsService.updateTimesheet(req.params.username, req.params.id, req.body);
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/students/:username/timesheets/:id */
router.delete('/:username/timesheets/:id', requireAuth, requireRole('student'), canAccessStudent, async (req, res, next) => {
  try {
    await timesheetsService.deleteTimesheet(req.params.username, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
