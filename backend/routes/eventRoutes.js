import express from 'express';

import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { checkEventLimit } from '../middleware/eventLimitMiddleware.js';
import passport from 'passport';
import checkBlacklist from '../middleware/checkBlacklist.js';

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering events by title or description
 *     responses:
 *       200:
 *         description: A list of events
 */
router.get('/', getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.get(     // 3. Доступ к защищенным маршрутам должен требовать аутентификации.
    '/:id', 
    passport.authenticate('jwt', { session: false }), checkBlacklist, getEventById);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *               createdBy:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', passport.authenticate('jwt', { session: false }), checkEventLimit, checkBlacklist, createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an existing event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.put('/:id', passport.authenticate('jwt', { session: false }), checkBlacklist, updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkBlacklist, deleteEvent);

export default router;