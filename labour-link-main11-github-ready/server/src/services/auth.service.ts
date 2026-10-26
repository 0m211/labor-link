import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import ServiceProvider from '../models/ServiceProvider';
import Admin from '../models/Admin';
import { generateAccessToken, generateRefreshToken, generateAdminToken } from '../utils/jwt';
import { sendOTPEmail } from './email.service';
import { AppError } from '../middlewares/errorHandler';

// Generate 6 digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate referral code
const generateReferralCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// ─── CUSTOMER AUTH ───────────────────────────────────────────

export const registerCustomer = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  services: string[];
}) => {
  const { name, email, phone, password, services } = data;

  // Check existing
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    throw new AppError('Email or phone already registered', 400);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Generate OTP
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    services,
    otp: { code: otp, expiresAt: otpExpiresAt },
    referralCode: generateReferralCode()
  });

  // Send OTP email
  console.log('OTP FOR TESTING:', otp)
  await sendOTPEmail(email, name, otp)
  

  return { message: 'OTP sent to your email', userId: user._id };
};

export const verifyCustomerOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('User not found', 404);
  if (user.isVerified) throw new AppError('Already verified', 400);

  if (user.otp.code !== otp) throw new AppError('Invalid OTP', 400);
  if (new Date() > user.otp.expiresAt) throw new AppError('OTP expired', 400);

  user.isVerified = true;
  user.otp = { code: '', expiresAt: new Date() };
  await user.save();

  // Generate tokens
  const payload = { id: user._id, role: 'customer' };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Save refresh token
  user.refreshTokens.push(refreshToken);
  await user.save();

  return { accessToken, refreshToken, user: {
    id: user._id, name: user.name, email: user.email,
    phone: user.phone, role: 'customer', avatar: user.avatar
  }};
};

export const loginCustomer = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401);
  if (!user.isActive) throw new AppError('Account deactivated', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  if (!user.isVerified) {
    // Resend OTP
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();
    await sendOTPEmail(user.email, user.name, otp);
    throw new AppError('Please verify your email first. OTP resent.', 403);
  }

  const payload = { id: user._id, role: 'customer' };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshTokens.push(refreshToken);
  await user.save();

  return { accessToken, refreshToken, user: {
    id: user._id, name: user.name, email: user.email,
    phone: user.phone, role: 'customer', avatar: user.avatar
  }};
};

// ─── PROVIDER AUTH ───────────────────────────────────────────

// export const registerProvider = async (data: {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
// }) => {
//   const { name, email, phone, password } = data;

//   const existing = await ServiceProvider.findOne({ $or: [{ email }, { phone }] });
//   if (existing) throw new AppError('Email or phone already registered', 400);

//   const passwordHash = await bcrypt.hash(password, 12);
//   const otp = generateOTP();
//   const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

//   const provider = await ServiceProvider.create({
//     name, email, phone, passwordHash,
//     otp: { code: otp, expiresAt: otpExpiresAt }
//   });

//   await sendOTPEmail(email, name, otp);

//   return { message: 'OTP sent to your email', providerId: provider._id };
// };
export const registerProvider = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  services: string[];
}) => {
  const { name, email, phone, password, services } = data;

  const existing = await ServiceProvider.findOne({
    $or: [{ email }, { phone }]
  });
  console.log("BACKEND RECEIVED:", data)
  console.log("BACKEND SERVICES:", data.services)

  if (existing) {
    throw new AppError('Email or phone already registered', 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const otp = generateOTP();

  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const provider = await ServiceProvider.create({
    name,
    email,
    phone,
    passwordHash,
    services,
    otp: {
      code: otp,
      expiresAt: otpExpiresAt
    }
  });

  await sendOTPEmail(email, name, otp);

  return {
    message: 'OTP sent to your email',
    providerId: provider._id
  };
};
export const verifyProviderOTP = async (email: string, otp: string) => {
  const provider = await ServiceProvider.findOne({ email });
  if (!provider) throw new AppError('Provider not found', 404);
  if (provider.isVerified) throw new AppError('Already verified', 400);

  if (provider.otp.code !== otp) throw new AppError('Invalid OTP', 400);
  if (new Date() > provider.otp.expiresAt) throw new AppError('OTP expired', 400);

  provider.isVerified = true;
  provider.otp = { code: '', expiresAt: new Date() };
  await provider.save();

  const payload = { id: provider._id, role: 'provider' };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  provider.refreshTokens.push(refreshToken);
  await provider.save();

  return { accessToken, refreshToken, provider: {
    id: provider._id, name: provider.name, email: provider.email,
    phone: provider.phone, role: 'provider', avatar: provider.avatar
  }};
};

export const loginProvider = async (email: string, password: string) => {
  const provider = await ServiceProvider.findOne({ email });
  if (!provider) throw new AppError('Invalid credentials', 401);
  if (!provider.isActive) throw new AppError('Account deactivated', 401);

  const isMatch = await provider.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  if (!provider.isVerified) {
    const otp = generateOTP();
    provider.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await provider.save();
    await sendOTPEmail(provider.email, provider.name, otp);
    throw new AppError('Please verify your email first. OTP resent.', 403);
  }

  const payload = { id: provider._id, role: 'provider' };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  provider.refreshTokens.push(refreshToken);
  await provider.save();

  return { accessToken, refreshToken, provider: {
    id: provider._id, name: provider.name, email: provider.email,
    phone: provider.phone, role: 'provider', avatar: provider.avatar
  }};
};

// ─── ADMIN AUTH ──────────────────────────────────────────────

export const loginAdmin = async (email: string, password: string) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new AppError('Invalid credentials', 401);
  if (!admin.isActive) throw new AppError('Account deactivated', 401);

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  const token = generateAdminToken({
    id: admin._id, role: admin.role, isAdmin: true
  });

  return { token, admin: {
    id: admin._id, name: admin.name,
    email: admin.email, role: admin.role
  }};
};

// ─── SHARED ──────────────────────────────────────────────────

export const resendOTP = async (email: string, userType: 'customer' | 'provider') => {
  if (userType === 'customer') {
    const user = await User.findOne({ email });
    if (!user) throw new AppError('User not found', 404);
    if (user.isVerified) throw new AppError('Already verified', 400);
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();
    await sendOTPEmail(email, user.name, otp);
  } else {
    const provider = await ServiceProvider.findOne({ email });
    if (!provider) throw new AppError('Provider not found', 404);
    if (provider.isVerified) throw new AppError('Already verified', 400);
    const otp = generateOTP();
    provider.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await provider.save();
    await sendOTPEmail(email, provider.name, otp);
  }
  return { message: 'OTP resent successfully' };
};

export const refreshAccessToken = async (
  refreshToken: string,
  userType: 'customer' | 'provider'
) => {
  const { verifyRefreshToken, generateAccessToken } = await import('../utils/jwt');

  let decoded: any;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }

  if (userType === 'customer') {
    const user = await User.findById(decoded.id);
    if (!user) throw new AppError('User not found', 404);
    if (!user.refreshTokens.includes(refreshToken)) {
      throw new AppError('Refresh token not valid', 401);
    }
    const newAccessToken = generateAccessToken({ id: user._id, role: 'customer' });
    return { accessToken: newAccessToken };
  } else {
    const provider = await ServiceProvider.findById(decoded.id);
    if (!provider) throw new AppError('Provider not found', 404);
    if (!provider.refreshTokens.includes(refreshToken)) {
      throw new AppError('Refresh token not valid', 401);
    }
    const newAccessToken = generateAccessToken({ id: provider._id, role: 'provider' });
    return { accessToken: newAccessToken };
  }
};

export const logout = async (
  userId: string,
  refreshToken: string,
  userType: 'customer' | 'provider'
) => {
  if (userType === 'customer') {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken }
    });
  } else {
    await ServiceProvider.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken }
    });
  }
  return { message: 'Logged out successfully' };
};