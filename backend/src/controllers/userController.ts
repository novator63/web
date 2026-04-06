import type { Request, Response } from 'express';
import { User } from '@models/index.js';

interface UserBody {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  birthDate?: string;
  email?: string;
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

const validateProfileFields = (
  body: UserBody,
):
  | {
      firstName: string;
      lastName: string;
      middleName: string | null;
      gender: 'male' | 'female';
      birthDate: string;
      name: string;
    }
  | { message: string } => {
  const firstName = normalizeName(body.firstName);
  const lastName = normalizeName(body.lastName);
  const middleName = normalizeName(body.middleName);
  const birthDate = (body.birthDate ?? '').trim();
  const gender = (body.gender ?? '').trim().toLowerCase();

  const fullName = [lastName, firstName, middleName].filter(Boolean).join(' ');

  if (!firstName || !lastName || !birthDate || !gender) {
    return { message: 'Fill in all fields' };
  }

  if (!isValidName(firstName) || !isValidName(lastName)) {
    return {
      message: `First name and last name length must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters`,
    };
  }

  if (middleName && !isValidName(middleName)) {
    return {
      message: `Middle name length must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters`,
    };
  }

  if (!GENDERS.includes(gender as (typeof GENDERS)[number])) {
    return { message: 'Gender must be one of: male, female' };
  }

  if (!isValidBirthDate(birthDate)) {
    return {
      message: 'Birth date must be a valid date between 1900-01-01 and today',
    };
  }

  return {
    firstName,
    lastName,
    middleName: middleName || null,
    gender: gender as 'male' | 'female',
    birthDate,
    name: fullName,
  };
};

export const createUser = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { email } = req.body as UserBody;
    const validated = validateProfileFields(req.body as UserBody);
    if ('message' in validated) {
      return res.status(400).json({ message: validated.message });
    }

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const newUser = await User.create({
      email,
      name: validated.name,
      firstName: validated.firstName,
      lastName: validated.lastName,
      middleName: validated.middleName,
      gender: validated.gender,
      birthDate: validated.birthDate,
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
      attributes: [
        'id',
        'name',
        'firstName',
        'lastName',
        'middleName',
        'gender',
        'birthDate',
        'email',
        'password',
        'createdAt',
      ],
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

export const getMyProfile = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch {
    return res.status(400).json({ message: 'Failed to fetch profile' });
  }
};

export const updateMyProfile = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validated = validateProfileFields(req.body as UserBody);
    if ('message' in validated) {
      return res.status(400).json({ message: validated.message });
    }

    await user.update({
      name: validated.name,
      firstName: validated.firstName,
      lastName: validated.lastName,
      middleName: validated.middleName,
      gender: validated.gender,
      birthDate: validated.birthDate,
    });

    return res.status(200).json(user);
  } catch {
    return res.status(400).json({ message: 'Failed to update profile' });
  }
};
