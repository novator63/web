import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '@config/env.js';
import BlacklistedToken from '@models/BlacklistedToken.js';
import User from '@models/User.js';

dotenv.config();

interface AuthBody {
  email?: string;
  name?: string;
  password?: string;
}

const jwtSecret = getJwtSecret();

export const register = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { email, name, password } = req.body as AuthBody;
  if (!email || !name || !password)
    return res.status(400).json({ message: 'Fill in all fields' });
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'Unable to register with provided data' });
    await User.create({ email, name, password });
    return res.status(201).json({ message: 'Registration successful' });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { email, password } = req.body as AuthBody;
  if (!email || !password)
    return res.status(400).json({ message: 'Fill in all fields' });
  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user || !user.password)
      return res.status(401).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '1h' },
    );
    return res.json({ message: 'Authorization successful', token });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, jwtSecret);
    await BlacklistedToken.create({ token, createdAt: new Date() });
    return res.json({ message: 'Logout successful' });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};
