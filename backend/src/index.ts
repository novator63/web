import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import passport from 'passport';
import sequelize from '@config/db.js';
import '@config/passport.js';
import { swaggerSpec, swaggerUi } from '@config/swagger.js';
import authRoutes from '@routes/authRoutes.js';
import eventRoutes from '@routes/eventRoutes.js';
import userRoutes from '@routes/userRoutes.js';

dotenv.config();

const app = express();
const jsonParser = express.json();

app.use(cors());
app.use((req, res, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next();
  }
  return jsonParser(req, res, next);
});
app.use(morgan(':method :url'));
app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
  ): void | Response => {
    if (error instanceof SyntaxError && 'body' in error) {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    return next(error);
  },
);

const PORT = Number(process.env.PORT) || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error: unknown) => {
    console.error('Unable to connect to the database:', error);
  });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error: unknown) => {
    console.error('Error synchronizing the database:', error);
  });

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on('error', (error: { code?: string }) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use. Please choose a different port.`,
      );
    } else {
      console.error('Server error:', error);
    }
  });
