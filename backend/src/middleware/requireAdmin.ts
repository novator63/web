import type { NextFunction, Request, Response } from 'express';
import { getAdminEmails } from '@config/env.js';

const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const adminEmails = getAdminEmails();
  const email = req.user?.email?.toLowerCase();

  if (!email || !adminEmails.includes(email)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return next();
};

export default requireAdmin;
