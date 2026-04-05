import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import passport from 'passport';
import sequelize from '@config/db.js';
import { getAllowedOrigins } from '@config/env.js';
import '@config/passport.js';
import { swaggerSpec, swaggerUi } from '@config/swagger.js';
import authRoutes from '@routes/authRoutes.js';
import eventRoutes from '@routes/eventRoutes.js';
import userRoutes from '@routes/userRoutes.js';

dotenv.config();

const app = express();
const jsonParser = express.json();
const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  }),
);
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
    error: Error & { body?: string; status?: number },
    _req: Request,
    res: Response,
    next: NextFunction,
  ): void | Response => {
    if (error.message === 'Not allowed by CORS') {
      return res.status(403).json({ message: 'CORS blocked this origin' });
    }
    if (error instanceof SyntaxError && 'body' in error) {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    if (error.status) {
      return res.status(error.status).json({ message: 'Request failed' });
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
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error);
  });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error: Error) => {
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
