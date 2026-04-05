import type { Request, Response } from 'express';
import { User } from '@models/index.js';

interface UserBody {
  name?: string;
  email?: string;
}

export const createUser = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { name, email } = req.body as UserBody;
    if (!name || !email)
      return res.status(400).json({ message: 'Name and email are required' });
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });
    const newUser = await User.create({
      name,
      email,
    });
    return res.status(201).json(newUser);
  } catch {
    return res.status(400).json({ message: 'Failed to create user' });
  }
};

export const getAllUsers = async (
  _req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const users = await User.unscoped().findAll({
      attributes: ['id', 'name', 'email', 'password', 'createdAt'],
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });
    return res.status(200).json(users);
  } catch {
    return res.status(400).json({ message: 'Failed to fetch users' });
  }
};
