import express from 'express';
import passport from 'passport';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from '@controllers/eventController.js';
import checkBlacklist from '@middleware/checkBlacklist.js';
import { checkEventLimit } from '@middleware/eventLimitMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Event management endpoints
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search by title or description
 *         example: meetup
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Failed to fetch events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  getAllEvents,
);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by id
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Failed to fetch event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  getEventById,
);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Team meetup
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Discuss project milestones
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-15T18:30:00.000Z
 *             required: [title, date]
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error or failed create
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkEventLimit,
  checkBlacklist,
  createEvent,
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update event by id
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated meetup title
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: New agenda
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-20T17:00:00.000Z
 *             required: [title, date]
 *     responses:
 *       200:
 *         description: Event updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Validation error or failed update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  updateEvent,
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete event by id
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Event deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Failed to delete event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkBlacklist,
  deleteEvent,
);

export default router;
