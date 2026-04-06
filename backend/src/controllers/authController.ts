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
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  birthDate?: string;
  password?: string;
}

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 40;
const GENDERS = ['male', 'female'] as const;

const normalizeName = (value: string | undefined): string =>
  (value ?? '').trim();

const isValidName = (value: string): boolean =>
  value.length >= NAME_MIN_LENGTH && value.length <= NAME_MAX_LENGTH;

const isValidBirthDate = (value: string): boolean => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;

  const now = new Date();
  const minDate = new Date('1900-01-01');
  return parsed <= now && parsed >= minDate;
};

const buildFullName = (
  lastName: string,
  firstName: string,
  middleName: string,
): string => [lastName, firstName, middleName].filter(Boolean).join(' ');

const jwtSecret = getJwtSecret();

export const register = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const {
    email,
    firstName,
    lastName,
    middleName,
    gender,
    birthDate,
    password,
  } = req.body as AuthBody;

  const firstNameNormalized = normalizeName(firstName);
  const lastNameNormalized = normalizeName(lastName);
  const middleNameNormalized = normalizeName(middleName);
  const birthDateNormalized = (birthDate ?? '').trim();
  const genderNormalized = (gender ?? '').trim().toLowerCase();

  if (
    !email ||
    !password ||
    !firstNameNormalized ||
    !lastNameNormalized ||
    !birthDateNormalized ||
    !genderNormalized
  ) {
    return res.status(400).json({ message: 'Fill in all fields' });
  }

  if (
    !isValidName(firstNameNormalized) ||
    !isValidName(lastNameNormalized)
  ) {
    return res.status(400).json({
      message: `First name and last name length must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters`,
    });
  }

  if (middleNameNormalized && !isValidName(middleNameNormalized)) {
    return res.status(400).json({
      message: `Middle name length must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters`,
    });
  }

  if (!GENDERS.includes(genderNormalized as (typeof GENDERS)[number])) {
    return res.status(400).json({
      message: 'Gender must be one of: male, female',
    });
  }

  if (!isValidBirthDate(birthDateNormalized)) {
    return res.status(400).json({
      message: 'Birth date must be a valid date between 1900-01-01 and today',
    });
  }

  const fullName = buildFullName(
    lastNameNormalized,
    firstNameNormalized,
    middleNameNormalized,
  );

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'Unable to register with provided data' });
    await User.create({
      email,
      name: fullName,
      firstName: firstNameNormalized,
      lastName: lastNameNormalized,
      middleName: middleNameNormalized || null,
      gender: genderNormalized as 'male' | 'female',
      birthDate: birthDateNormalized,
      password,
    });
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
      {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        gender: user.gender,
        birthDate: user.birthDate,
      },
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
