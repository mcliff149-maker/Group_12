import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';
import { validate }           from '../middleware/validate.js';
import { requireAuth }        from '../middleware/auth.js';
import { signInSchema, signUpSchema } from '../schemas/auth.js';
import { verifyCredentials, createUser, findByUsername, publicView } from '../services/users.js';

const router = Router();

/** POST /api/auth/signin */
router.post('/signin', validate(signInSchema), async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const user  = await verifyCredentials(username, password, role);
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ user: publicView(user), token });
  } catch (err) {
    next(err);
  }
});

/** POST /api/auth/signup */
router.post('/signup', validate(signUpSchema), async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

/** GET /api/auth/me – return current user from token */
router.get('/me', requireAuth, async (req, res) => {
  res.json(publicView(req.user));
});

export default router;
