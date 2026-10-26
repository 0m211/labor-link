import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as paymentService from '../services/payment.service';
import { sendSuccess } from '../utils/response';
import crypto from 'crypto';

export const createOrderHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ success: false, message: 'Booking ID required' });
    const booking = await (await import('../models/Booking')).default.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    const order = await paymentService.createOrder(bookingId, booking.customerId.toString());
    sendSuccess(res, 'Order created', order, 201);
  } catch (error) { next(error); }
};

export const verifyPaymentHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await paymentService.verifyPayment(req.body);
    sendSuccess(res, 'Payment verified successfully', payment);
  } catch (error) { next(error); }
};

export const getPaymentHistoryHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const payments = await paymentService.getPaymentHistory(req.user!.id);
    sendSuccess(res, 'Payment history fetched', payments);
  } catch (error) { next(error); }
};

export const webhookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    if (event === 'payment.captured') {
      const paymentId = req.body.payload.payment.entity.id;
      const orderId = req.body.payload.payment.entity.order_id;
      // Handle webhook payment capture
    }

    res.json({ status: 'ok' });
  } catch (error) { next(error); }
};

export const refundHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, reason } = req.body;
    const result = await paymentService.processRefund(bookingId, reason);
    sendSuccess(res, result.message);
  } catch (error) { next(error); }
};