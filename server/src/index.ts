import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import mailRoutes from './routes/mail.routes';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.static("public"));

// Middleware
app.use('/templates', express.static(path.join(__dirname, 'templates')));

app.use('/', express.static(path.join(__dirname, 'public')));

// Routes
const apiRoutes = (i: string) => `/api/${i}`;
const routes = {
  auth: authRoutes,
  users: userRoutes,
  mail: mailRoutes,
};

for (const [key, router] of Object.entries(routes)) {
  app.use(apiRoutes(key), router);
}

// Start the server after database connection
const startServer = async () => {
  try {
    try {
      await AppDataSource.initialize();
    } catch (err) {
      console.error('Failed to connect to AppDataSource', err);
      process.exit(1);
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error during Data Source initialization', error);
  }
};

startServer();
