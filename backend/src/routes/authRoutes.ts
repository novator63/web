import express from 'express';
import passport from 'passport';
import { login, logout, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  logout,
);

export default router;
