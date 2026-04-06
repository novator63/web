declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      middleName: string | null;
      gender: 'male' | 'female';
      birthDate: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
