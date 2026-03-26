import express from 'express';
import passport from 'passport';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from '../controllers/eventController.js';
import checkBlacklist from '../middleware/checkBlacklist.js';
import { checkEventLimit } from '../middleware/eventLimitMiddleware.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  getEventById,
);
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkEventLimit,
  checkBlacklist,
  createEvent,
);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  updateEvent,
);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  deleteEvent,
);

export default router;
