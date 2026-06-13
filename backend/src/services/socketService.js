import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';

const userSockets = new Map();

export const initializeSocket = (httpServer, config) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    // withCredentials sends httpOnly cookies in the handshake headers
    let token = socket.handshake.auth.token;

    if (!token) {
      const cookieHeader = socket.handshake.headers.cookie || '';
      const tokenEntry = cookieHeader.split(';').find(c => c.trim().startsWith('token='));
      if (tokenEntry) {
        token = decodeURIComponent(tokenEntry.split('=')[1].trim());
      }
    }

    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Invalid token'));
    }

    socket.userId = decoded.userId;
    next();
  });

  io.on('connection', (socket) => {
    userSockets.set(socket.userId, socket.id);
    console.log(`User ${socket.userId} connected`);

    socket.on('join-match', (matchId) => {
      socket.join(`match-${matchId}`);
    });

    socket.on('leave-match', (matchId) => {
      socket.leave(`match-${matchId}`);
    });

    socket.on('send-message', (data) => {
      io.to(`match-${data.matchId}`).emit('receive-message', data);
    });

    socket.on('typing', (data) => {
      socket.to(`match-${data.matchId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    socket.on('disconnect', () => {
      userSockets.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    });
  });

  return io;
};

export const isUserOnline = (userId) => {
  return userSockets.has(userId);
};

export const getUserSocketId = (userId) => {
  return userSockets.get(userId);
};
