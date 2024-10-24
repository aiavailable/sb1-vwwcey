import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Enable CORS with specific configuration
app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic route for health check
app.get('/', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['polling', 'websocket'],
  path: '/socket.io',
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  allowUpgrades: true,
  cookie: {
    name: 'socket.io',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
});

// Store connected users and messages
const connectedUsers = new Map();
const messages = [];

// Handle socket connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle authentication
  socket.on('authenticate', (userId) => {
    if (!userId) {
      socket.emit('auth_error', 'User ID is required');
      return;
    }

    try {
      connectedUsers.set(socket.id, userId);
      socket.join(userId);
      console.log(`User ${userId} authenticated`);
      
      // Notify other users
      socket.broadcast.emit('user_online', userId);
      
      // Send initial data
      const userMessages = messages.filter(msg => 
        msg.senderId === userId || msg.receiverId === userId
      );
      socket.emit('initial_messages', userMessages);
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth_error', 'Failed to authenticate');
    }
  });

  // Handle messages
  socket.on('send_message', (message) => {
    try {
      const userId = connectedUsers.get(socket.id);
      if (!userId) {
        socket.emit('error', 'Not authenticated');
        return;
      }

      const messageId = uuidv4();
      const newMessage = {
        id: messageId,
        ...message,
        senderId: userId,
        timestamp: new Date().toISOString(),
        read: false
      };

      messages.push(newMessage);
      io.to(message.receiverId).emit('new_message', newMessage);
      socket.emit('message_sent', messageId);
    } catch (error) {
      console.error('Message error:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  // Handle read receipts
  socket.on('mark_read', (messageId) => {
    try {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.read = true;
        io.to(message.senderId).emit('message_read', messageId);
      }
    } catch (error) {
      console.error('Read receipt error:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing_start', ({ conversationId }) => {
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      socket.to(conversationId).emit('typing_start', { userId, conversationId });
    }
  });

  socket.on('typing_end', ({ conversationId }) => {
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      socket.to(conversationId).emit('typing_end', { userId, conversationId });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      socket.broadcast.emit('user_offline', userId);
      connectedUsers.delete(socket.id);
      console.log(`User ${userId} disconnected`);
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  httpServer.close(() => {
    process.exit(1);
  });
});