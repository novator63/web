import type { RequestLike, ResponseLike } from '../types/http.js';
import { User } from '../models/index.js';

interface UserBody {
  name?: string;
  email?: string;
}

export const createUser = async (
  req: RequestLike,
  res: ResponseLike,
): Promise<ResponseLike | void> => {
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
      password: 'temporary-password',
    });
    return res.status(201).json(newUser);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res
      .status(400)
      .json({ message: 'Failed to create user', error: message });
  }
};

export const getAllUsers = async (
  _req: RequestLike,
  res: ResponseLike,
): Promise<ResponseLike | void> => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res
      .status(400)
      .json({ message: 'Failed to fetch users', error: message });
  }
};
