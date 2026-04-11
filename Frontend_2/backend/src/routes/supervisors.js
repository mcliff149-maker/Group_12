import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate }    from '../middleware/validate.js';
import * as verificationsService from '../services/verifications.js';
import { listUsers } from '../services/users.js';

const router = Router();

router.use(requireAuth, requireRole('supervisor', 'admin'));

const verificationSchema = z.object({
  studentUsername: z.string().min(1),
  periodStart:     z.string().min(1),
  periodEnd:       z.string().min(1),
  hoursCompleted:  z.coerce.number().min(0),
  performance:     z.enum(['Excellent', 'Good', 'Satisfactory', 'Needs Improvement']),
  comments:        z.string().optional().default(''),
});

/** GET /api/supervisors/students – list student accounts */
router.get('/students', async (req, res, next) => {
  try {
    const all = await listUsers();
    res.json(all.filter(u => u.role === 'student'));
  } catch (err) {
    next(err);
  }
});

/** GET /api/supervisors/verifications */
router.get('/verifications', async (req, res, next) => {
  try {
    res.json(await verificationsService.getVerifications(req.user.username));
  } catch (err) {
    next(err);
  }
});

/** POST /api/supervisors/verifications */
router.post('/verifications', validate(verificationSchema), async (req, res, next) => {
  try {
    const entry = await verificationsService.submitVerification(req.user.username, req.body);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

export default router;
