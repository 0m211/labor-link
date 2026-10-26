// import { Router } from 'express';
// import { protect } from '../middlewares/auth.middleware';
// import { authorize } from '../middlewares/role.middleware';
// import {
//   createBookingHandler,
//   getCustomerBookingsHandler,
//   getProviderBookingsHandler,
//   acceptBookingHandler,
//   rejectBookingHandler,
//   cancelBookingHandler,
//   updateStatusHandler
// } from '../controllers/booking.controller';

// const router = Router();

// // Customer routes
// router.post('/', protect, authorize('customer'), createBookingHandler);
// router.get('/customer', protect, authorize('customer'), getCustomerBookingsHandler);
// router.put('/:bookingId/cancel', protect, cancelBookingHandler);

// // Provider routes
// router.get('/provider', protect, authorize('provider'), getProviderBookingsHandler);
// router.put('/:bookingId/accept', protect, authorize('provider'), acceptBookingHandler);
// router.put('/:bookingId/reject', protect, authorize('provider'), rejectBookingHandler);
// router.put('/:bookingId/status', protect, authorize('provider'), updateStatusHandler);

// export default router;
import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import {
  createBookingHandler,
  getCustomerBookingsHandler,
  getProviderBookingsHandler,
  acceptBookingHandler,
  rejectBookingHandler,
  cancelBookingHandler,
  updateStatusHandler
} from '../controllers/booking.controller';

const router = Router();

router.post('/', protect, authorize('customer'), createBookingHandler);
router.get('/customer', protect, authorize('customer'), getCustomerBookingsHandler);
router.get('/provider', protect, authorize('provider'), getProviderBookingsHandler);
router.put('/:bookingId/cancel', protect, cancelBookingHandler);
router.put('/:bookingId/accept', protect, authorize('provider'), acceptBookingHandler);
router.put('/:bookingId/reject', protect, authorize('provider'), rejectBookingHandler);
router.put('/:bookingId/status', protect, authorize('provider'), updateStatusHandler);

export default router;