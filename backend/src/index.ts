import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import sequelize from './config/db.js';
import './config/passport.js';
import { swaggerSpec, swaggerUi } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(':method :url'));
app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

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
