import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger';

let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Customer joins their room
    socket.on('join:customer', (customerId: string) => {
      socket.join(`customer:${customerId}`);
      logger.info(`Customer ${customerId} joined room`);
    });

    // Provider joins their room
    socket.on('join:provider', (providerId: string) => {
      socket.join(`provider:${providerId}`);
      logger.info(`Provider ${providerId} joined room`);
    });

    // Provider sends live location
    socket.on('location:update', (data: {
      bookingId: string;
      providerId: string;
      customerId: string;
      lat: number;
      lng: number;
    }) => {
      io.to(`customer:${data.customerId}`).emit('location:provider_moved', {
        bookingId: data.bookingId,
        lat: data.lat,
        lng: data.lng
      });
    });

    // Chat message
    socket.on('chat:send', (data: {
      bookingId: string;
      senderId: string;
      receiverId: string;
      text: string;
      senderType: 'customer' | 'provider'
    }) => {
      const room = data.senderType === 'customer'
        ? `provider:${data.receiverId}`
        : `customer:${data.receiverId}`

      io.to(room).emit('chat:message', {
        bookingId: data.bookingId,
        senderId: data.senderId,
        text: data.text,
        createdAt: new Date()
      });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getSocketInstance = (): Server => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};