// import { Router, Response } from 'express';
// import { protect } from '../middlewares/auth.middleware';
// import { authorize } from '../middlewares/role.middleware';
// import { AuthRequest } from '../middlewares/auth.middleware';
// import ServiceProvider from '../models/ServiceProvider';
// import Booking from '../models/Booking';
// import { sendSuccess } from '../utils/response';
// import { getSocketInstance } from '../socket';

// const router = Router();

// router.put('/availability', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
//   try {
//     const { isOnline, lat, lng } = req.body;
//     const update: any = { isOnline }
//     if (lat && lng) update.location = { type: 'Point', coordinates: [lng, lat] }
//     const provider = await ServiceProvider.findByIdAndUpdate(req.user!.id, update, { new: true })
//     sendSuccess(res, `You are now ${isOnline ? 'Online' : 'Offline'}`, provider)
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' })
//   }
// })

// router.get('/profile', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
//   try {
//     const provider = await ServiceProvider.findById(req.user!.id).select('-passwordHash -refreshTokens')
//     sendSuccess(res, 'Profile fetched', provider)
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' })
//   }
// })

// router.put('/profile', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
//   try {
//     const { name, bio, experience, bankDetails } = req.body
//     const provider = await ServiceProvider.findByIdAndUpdate(
//       req.user!.id,
//       { name, bio, experience, bankDetails },
//       { new: true }
//     ).select('-passwordHash -refreshTokens')
//     sendSuccess(res, 'Profile updated', provider)
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' })
//   }
// })

// router.put('/bookings/:bookingId/accept', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
//   try {
//     const { bookingId } = req.params
//     const providerId = req.user!.id

//     const booking = await Booking.findById(bookingId)
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
//     if (booking.status !== 'searching') return res.status(409).json({ success: false, message: 'Booking no longer available' })

//     const updated = await Booking.findByIdAndUpdate(
//       bookingId,
//       { providerId, status: 'assigned', acceptedAt: new Date() },
//       { new: true }
//     ).populate('customerId serviceId providerId')

//     const io = getSocketInstance()
//     const customer = updated?.customerId as any
//     io.to(`customer:${customer?._id}`).emit('booking:assigned', { booking: updated })
//     io.emit(`booking:taken:${bookingId}`, { message: 'Booking assigned' })

//     sendSuccess(res, 'Booking accepted', updated)
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' })
//   }
// })

// router.put('/bookings/:bookingId/reject', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
//   try {
//     sendSuccess(res, 'Booking rejected')
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error' })
//   }
// })

// export default router;

import { Router, Response } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import ServiceProvider from '../models/ServiceProvider';
import Booking from '../models/Booking';
import { sendSuccess } from '../utils/response';
import { getSocketInstance } from '../socket';

const router = Router();

router.put('/availability', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
  try {
    const { isOnline, lat, lng } = req.body;
    const update: any = { isOnline }
    if (lat && lng) {
      update.location = { type: 'Point', coordinates: [Number(lng), Number(lat)] }
    }
    const provider = await ServiceProvider.findByIdAndUpdate(req.user!.id, update, { new: true })
    console.log('REQ USER ID:', req.user!.id)
    console.log('PROVIDER FOUND:', provider)
    if (!provider) {
    return res.status(404).json({
    success: false,
    message: 'Provider not found'
  })
}

    sendSuccess(res, `You are now ${isOnline ? 'Online' : 'Offline'}`, provider)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.get('/profile', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
  try {
    const provider = await ServiceProvider.findById(req.user!.id).select('-passwordHash -refreshTokens')
    sendSuccess(res, 'Profile fetched', provider)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.put('/profile', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, experience, bankDetails } = req.body
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.user!.id,
      { name, bio, experience, bankDetails },
      { new: true }
    ).select('-passwordHash -refreshTokens')
    sendSuccess(res, 'Profile updated', provider)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.put('/bookings/:bookingId/accept', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.params
    const providerId = req.user!.id

    const booking = await Booking.findById(bookingId)
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    if (booking.status !== 'searching' && booking.status !== 'pending') {
      return res.status(409).json({ success: false, message: 'Booking no longer available' })
    }

    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { providerId, status: 'assigned', acceptedAt: new Date() },
      { new: true }
    ).populate('customerId serviceId providerId')

    const io = getSocketInstance()
    const customer = updated?.customerId as any
    io.to(`customer:${customer?._id}`).emit('booking:assigned', { booking: updated })
    io.emit(`booking:taken:${bookingId}`, { message: 'Booking assigned' })

    sendSuccess(res, 'Booking accepted', updated)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.put('/bookings/:bookingId/reject', protect, authorize('provider'), async (req: AuthRequest, res: Response) => {
  try {
    sendSuccess(res, 'Booking rejected')
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router;