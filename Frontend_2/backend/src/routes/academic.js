import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate }    from '../middleware/validate.js';
import * as reviewsService from '../services/reviews.js';
import * as logsService    from '../services/logs.js';

const router = Router();

router.use(requireAuth, requireRole('academic', 'admin'));

const reviewSchema = z.object({
  studentUsername:  z.string().min(1),
  logId:            z.string().min(1),
  score:            z.coerce.number().min(0).max(100),
  feedback:         z.string().min(1),
  recommendation:   z.enum(['Approve', 'Reject', 'Revise']),
  comments:         z.string().optional().default(''),
  reviewDate:       z.string().min(1),
});

/** GET /api/academic/reviews – reviews by this academic */
router.get('/reviews', async (req, res, next) => {
  try {
    const reviews = await reviewsService.getReviews({ reviewerUsername: req.user.username });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

/** POST /api/academic/reviews */
router.post('/reviews', validate(reviewSchema), async (req, res, next) => {
  try {
    const review = await reviewsService.createReview(req.user.username, req.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

/** GET /api/academic/students/:username/logs – fetch a student's logs for review */
router.get('/students/:username/logs', async (req, res, next) => {
  try {
    res.json(await logsService.getLogs(req.params.username));
  } catch (err) {
    next(err);
  }
});

export default router;
