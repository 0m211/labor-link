import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { rateLimit } from 'express-rate-limit';

import { connectDB } from './config/db';
import { initSocket } from './socket';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import providerRoutes from './routes/provider.routes';
import bookingRoutes from './routes/booking.routes';
import serviceRoutes from './routes/service.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes';
import chatRoutes from './routes/chat.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';
dotenv.config();

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);

// Connect Database
connectDB();

// Init Socket.io
initSocket(httpServer);

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    'https://kaaragir.in',
    'https://www.kaaragir.in',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many auth attempts, please try again later.'
});

app.use('/api', limiter);
app.use('/api/auth', authLimiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Labour Link API is running' });
});

// API Routes
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', userRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;