import express from 'express';
import passport from 'passport';
import {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
} from '@controllers/userController.js';
import checkBlacklist from '@middleware/checkBlacklist.js';
import requireAdmin from '@middleware/requireAdmin.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Failed to fetch users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  requireAdmin,
  getAllUsers,
);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Ivan
 *               lastName:
 *                 type: string
 *                 example: Ivanov
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example: Ivanovich
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: male
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2000-05-21
 *             required: [firstName, lastName, gender, birthDate]
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  getMyProfile,
);

router.patch(
  '/me',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  updateMyProfile,
);

export default router;
