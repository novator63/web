import { Op } from 'sequelize';
import type { NextFunction, Request, Response } from 'express';
import { Event } from '../models/index.js';

export const checkEventLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const createdBy = req.user?.id;
    if (!createdBy)
      return res.status(400).json({ message: 'createdBy is required' });
    const limit = Number(process.env.EVENT_LIMIT_PER_DAY) || 3;
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const eventCount = await Event.count({
      where: { createdBy, createdAt: { [Op.gte]: last24Hours } },
    });
    if (eventCount >= limit) {
      return res
        .status(400)
        .json({ message: `Event limit of ${limit} per day exceeded` });
    }
    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res
      .status(400)
      .json({ message: 'Failed to check event limit', error: message });
  }
};
