import { Router, Response } from 'express';
import { protectAdmin } from '../middlewares/auth.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generateAdminToken } from '../utils/jwt';
import Admin from '../models/Admin';
import User from '../models/User';
import ServiceProvider from '../models/ServiceProvider';
import Booking from '../models/Booking';
import Payment from '../models/Payment';
import Review from '../models/Review';
import { sendSuccess } from '../utils/response';

const router = Router();

// Admin Login
router.post('/login', async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateAdminToken({ id: admin._id, role: admin.role, isAdmin: true });
    sendSuccess(res, 'Login successful', { token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Dashboard Stats
router.get('/dashboard', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalProviders, totalBookings, totalRevenue, pendingKyc, activeBookings] = await Promise.all([
      User.countDocuments(),
      ServiceProvider.countDocuments(),
      Booking.countDocuments(),
      Payment.aggregate([{ $match: { status: 'captured' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      ServiceProvider.countDocuments({ 'kyc.status': 'pending' }),
      Booking.countDocuments({ status: { $in: ['searching', 'assigned', 'en_route', 'in_progress'] } })
    ]);
    sendSuccess(res, 'Dashboard stats', {
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingKyc,
      activeBookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Users
router.get('/users', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
    const users = await User.find(query).select('-passwordHash -refreshTokens').sort({ createdAt: -1 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
    const total = await User.countDocuments(query);
    sendSuccess(res, 'Users fetched', { users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/users/:id/status', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { isActive } = req.body;
    await User.findByIdAndUpdate(req.params.id, { isActive });
    sendSuccess(res, `User ${isActive ? 'activated' : 'deactivated'}`);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Providers
router.get('/providers', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const providers = await ServiceProvider.find().select('-passwordHash -refreshTokens').sort({ createdAt: -1 });
    sendSuccess(res, 'Providers fetched', providers);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/providers/pending-kyc', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const providers = await ServiceProvider.find({ 'kyc.status': 'pending' }).select('-passwordHash -refreshTokens');
    sendSuccess(res, 'Pending KYC fetched', providers);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/providers/:id/kyc', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, rejectionReason } = req.body;
    await ServiceProvider.findByIdAndUpdate(req.params.id, {
      'kyc.status': status,
      'kyc.rejectionReason': rejectionReason || '',
      'kyc.verifiedAt': status === 'approved' ? new Date() : null,
      isVerified: status === 'approved'
    });
    sendSuccess(res, `KYC ${status}`);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Bookings
router.get('/bookings', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const query = status ? { status } : {};
    const bookings = await Booking.find(query)
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Booking.countDocuments(query);
    sendSuccess(res, 'Bookings fetched', { bookings, total });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Revenue
router.get('/revenue', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const revenue = await Payment.aggregate([
      { $match: { status: 'captured' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);
    sendSuccess(res, 'Revenue fetched', revenue);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reviews
router.get('/reviews', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate('customerId', 'name')
      .populate('providerId', 'name')
      .sort({ createdAt: -1 });
    sendSuccess(res, 'Reviews fetched', reviews);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/reviews/:id/hide', protectAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { isHidden: true });
    sendSuccess(res, 'Review hidden');
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;