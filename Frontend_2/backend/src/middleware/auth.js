import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { findByUsername } from '../services/users.js';

/**
 * Verifies the JWT in the Authorization header and attaches
 * the full user record to req.user.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user    = await findByUsername(payload.username);
    if (!user || user.disabled) {
      return res.status(401).json({ message: 'Account not found or disabled.' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
