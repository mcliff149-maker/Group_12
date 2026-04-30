import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate }    from '../middleware/validate.js';
import { createUserSchema } from '../schemas/auth.js';
import { listUsers, createUser, toggleDisable } from '../services/users.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(requireAuth, requireRole('admin'));

/** GET /api/admin/users */
router.get('/users', async (req, res, next) => {
  try {
    res.json(await listUsers());
  } catch (err) {
    next(err);
  }
});

/** POST /api/admin/users */
router.post('/users', validate(createUserSchema), async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

/** PATCH /api/admin/users/:username/toggle-disable */
router.patch('/users/:username/toggle-disable', async (req, res, next) => {
  try {
    const user = await toggleDisable(req.params.username);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
