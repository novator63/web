import { Op } from 'sequelize';
import type { Request, Response } from 'express';
import { getAdminEmails } from '@config/env.js';
import { Event as EventModel } from '@models/index.js';

interface EventBody {
  title?: string;
  description?: string;
  date?: string;
}

export const getAllEvents = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email?.toLowerCase();
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const isAdmin = Boolean(userEmail && getAdminEmails().includes(userEmail));

    const search = req.query.search;
    const whereClause = {
      ...(isAdmin ? {} : { createdBy: userId }),
      ...(search
        ? {
            [Op.or]: [
              { title: { [Op.iLike]: `%${search}%` } },
              { description: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {}),
    };
    const events = await EventModel.findAll({
      where: whereClause,
      order: [
        ['date', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    return res.status(200).json(events);
  } catch {
    return res.status(400).json({ message: 'Failed to fetch events' });
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const event = await EventModel.findOne({
      where: { id: Number(req.params.id), createdBy: userId },
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.status(200).json(event);
  } catch {
    return res.status(400).json({ message: 'Failed to fetch event' });
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { title, description, date } = req.body as EventBody;
    if (!title || !date || !req.user?.id)
      return res.status(400).json({ message: 'Title and date are required' });
    const newEvent = await EventModel.create({
      title,
      description: description ?? null,
      date: new Date(date),
      createdBy: req.user.id,
    });
    return res.status(201).json(newEvent);
  } catch {
    return res.status(400).json({ message: 'Failed to create event' });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const event = await EventModel.findOne({
      where: { id: Number(req.params.id), createdBy: req.user?.id },
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const { title, description, date } = req.body as EventBody;
    if (!title || !date)
      return res.status(400).json({ message: 'Title and date are required' });
    await event.update({
      title,
      description: description ?? null,
      date: new Date(date),
    });
    return res.status(200).json(event);
  } catch {
    return res.status(400).json({ message: 'Failed to update event' });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const event = await EventModel.findOne({
      where: { id: Number(req.params.id), createdBy: req.user?.id },
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await event.destroy();
    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch {
    return res.status(400).json({ message: 'Failed to delete event' });
  }
};
