import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Unauthorized
 */
router.get('/', passport.authenticate('jwt', { session: false }), getAllUsers);

export default router;