import { Op } from 'sequelize';
import type { Request, Response } from 'express';
import { Event as EventModel } from '@models/index.js';

interface EventBody {
  title?: string;
  description?: string;
  date?: string;
  category?: string;
}

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 500;
const CATEGORY_MIN_LENGTH = 2;
const CATEGORY_MAX_LENGTH = 40;

const validateEventBody = (
  body: EventBody,
):
  | {
      title: string;
      description: string | null;
      category: string;
      date: Date;
    }
  | { message: string } => {
  const title = body.title?.trim() ?? '';
  const descriptionRaw = body.description?.trim() ?? '';
  const dateRaw = body.date?.trim() ?? '';
  const categoryRaw = body.category?.trim() ?? '';

  if (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH) {
    return {
      message: `Title length must be between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters`,
    };
  }

  if (descriptionRaw.length > DESCRIPTION_MAX_LENGTH) {
    return {
      message: `Description length must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
    };
  }

  if (!categoryRaw) {
    return { message: 'Event category is required' };
  }

  if (
    categoryRaw.length < CATEGORY_MIN_LENGTH ||
    categoryRaw.length > CATEGORY_MAX_LENGTH
  ) {
    return {
      message: `Event category length must be between ${CATEGORY_MIN_LENGTH} and ${CATEGORY_MAX_LENGTH} characters`,
    };
  }

  if (!dateRaw) {
    return { message: 'Event date is required' };
  }

  const parsedDate = new Date(dateRaw);
  if (Number.isNaN(parsedDate.getTime())) {
    return { message: 'Invalid event date' };
  }

  if (parsedDate.getTime() < Date.now()) {
    return { message: 'Event date cannot be in the past' };
  }

  return {
    title,
    description: descriptionRaw.length ? descriptionRaw : null,
    category: categoryRaw,
    date: parsedDate,
  };
};

export const getAllEvents = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const whereClause = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { category: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
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
    const event = await EventModel.findOne({
      where: { id: Number(req.params.id) },
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
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const validated = validateEventBody(req.body as EventBody);
    if ('message' in validated) {
      return res.status(400).json({ message: validated.message });
    }

    const newEvent = await EventModel.create({
      title: validated.title,
      description: validated.description,
      category: validated.category,
      date: validated.date,
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

    const validated = validateEventBody(req.body as EventBody);
    if ('message' in validated) {
      return res.status(400).json({ message: validated.message });
    }

    await event.update({
      title: validated.title,
      description: validated.description,
      category: validated.category,
      date: validated.date,
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
