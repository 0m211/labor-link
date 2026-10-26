import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment';
import Booking from '../models/Booking';
import ServiceProvider from '../models/ServiceProvider';
import WalletTransaction from '../models/WalletTransaction';
import { AppError } from '../middlewares/errorHandler';

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export const createOrder = async (bookingId: string, customerId: string) => {
  const razorpay = getRazorpay();
  const booking = await Booking.findById(bookingId);
  const amount = ((booking?.pricing?.totalAmount || 499) * 100);

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `booking_${bookingId}`
  });

  const payment = await Payment.create({
    bookingId,
    customerId,
    providerId: booking?.providerId,
    amount,
    method: 'razorpay',
    status: 'pending',
    razorpay: { orderId: order.id, paymentId: '', signature: '' },
    refund: { refundId: '', amount: 0, reason: '' }
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    paymentId: payment._id,
    key: process.env.RAZORPAY_KEY_ID
  };
};

export const verifyPayment = async (data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  bookingId: string;
}) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = data;

  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError('Payment verification failed', 400);
  }

  const payment = await Payment.findOneAndUpdate(
    { 'razorpay.orderId': razorpayOrderId },
    { status: 'captured', 'razorpay.paymentId': razorpayPaymentId, 'razorpay.signature': razorpaySignature },
    { new: true }
  );

  if (!payment) throw new AppError('Payment not found', 404);

  await Booking.findByIdAndUpdate(bookingId, { paymentId: payment._id, status: 'completed' });

  const booking = await Booking.findById(bookingId);
  if (booking?.providerId) {
    const providerEarning = Math.floor(payment.amount * 0.85);
    await ServiceProvider.findByIdAndUpdate(booking.providerId, {
      $inc: { 'wallet.balance': providerEarning, 'wallet.totalEarned': providerEarning }
    });
    await WalletTransaction.create({
      providerId: booking.providerId,
      type: 'credit',
      amount: providerEarning,
      description: `Payment for booking #${booking.bookingNumber}`,
      bookingId: booking._id,
      status: 'completed'
    });
  }

  return payment;
};

export const getPaymentHistory = async (customerId: string) => {
  return await Payment.find({ customerId })
    .populate('bookingId', 'bookingNumber')
    .sort({ createdAt: -1 });
};

export const processRefund = async (bookingId: string, reason: string) => {
  const razorpay = getRazorpay();
  const payment = await Payment.findOne({ bookingId, status: 'captured' });
  if (!payment) throw new AppError('No payment found', 404);
  const refund = await razorpay.payments.refund(payment.razorpay.paymentId, { amount: payment.amount });
  await Payment.findByIdAndUpdate(payment._id, {
    status: 'refunded',
    refund: { refundId: refund.id, amount: payment.amount, reason, refundedAt: new Date() }
  });
  return { message: 'Refund processed' };
};