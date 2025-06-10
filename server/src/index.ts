import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
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
  mail: mailRoutes,
};

for (const [key, router] of Object.entries(routes)) {
  app.use(apiRoutes(key), router);
}

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Exit the process on failure
  }
};

startServer();
