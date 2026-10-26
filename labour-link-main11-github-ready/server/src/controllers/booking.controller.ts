import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as bookingService from '../services/booking.service';
import { sendSuccess } from '../utils/response';

export const createBookingHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, serviceId, address, problemDescription, scheduledAt } = req.body;
    const customerId = req.user!.id;

    let booking;
    if (type === 'instant') {
      booking = await bookingService.createInstantBooking({
        customerId,
        serviceId,
        address,
        problemDescription
      });
    } else {
      booking = await bookingService.createScheduledBooking({
        customerId,
        serviceId,
        address,
        problemDescription,
        scheduledAt: new Date(scheduledAt)
      });
    }

    sendSuccess(res, 'Booking created successfully', booking, 201);
  } catch (error) { next(error); }
};

export const getCustomerBookingsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await bookingService.getCustomerBookings(req.user!.id);
    sendSuccess(res, 'Bookings fetched', bookings);
  } catch (error) { next(error); }
};

export const getProviderBookingsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await bookingService.getProviderBookings(req.user!.id);
    sendSuccess(res, 'Bookings fetched', bookings);
  } catch (error) { next(error); }
};

export const acceptBookingHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const providerId = req.user!.id;
    const booking = await bookingService.acceptBooking(bookingId, providerId);
    sendSuccess(res, 'Booking accepted', booking);
  } catch (error) { next(error); }
};

export const rejectBookingHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const result = await bookingService.rejectBooking(bookingId, req.user!.id);
    sendSuccess(res, result.message);
  } catch (error) { next(error); }
};

export const cancelBookingHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const cancelledBy = req.user!.role as 'customer' | 'provider' | 'admin';
    const booking = await bookingService.cancelBooking(
      bookingId,
      req.user!.id,
      cancelledBy,
      reason
    );
    sendSuccess(res, 'Booking cancelled', booking);
  } catch (error) { next(error); }
};

export const updateStatusHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(bookingId, status);
    sendSuccess(res, 'Status updated', booking);
  } catch (error) { next(error); }
};