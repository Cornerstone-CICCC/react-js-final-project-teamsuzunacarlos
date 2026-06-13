import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import http from 'http';
import { connectDB, disconnectDB } from './config/database.js';
import { config, validateConfig } from './config/env.js';
import { initializeSocket } from './services/socketService.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import sockRoutes from './routes/socks.js';
import matchRoutes from './routes/matches.js';
import messageRoutes from './routes/messages.js';

validateConfig();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Initialize Socket.IO
initializeSocket(server, config);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/socks', sockRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Server
const start = async () => {
  try {
    await connectDB();
    server.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await disconnectDB();
  process.exit(0);
});

start();
