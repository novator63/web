import express from 'express';
import passport from 'passport';
import { getAllUsers } from '../controllers/userController.js';
import checkBlacklist from '../middleware/checkBlacklist.js';

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  getAllUsers,
);

export default router;
