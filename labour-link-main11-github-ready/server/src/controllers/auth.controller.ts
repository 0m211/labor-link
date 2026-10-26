import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/response';

export const registerCustomerHandler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const result = await authService.registerCustomer(req.body);
    sendSuccess(res, result.message, { userId: result.userId }, 201);
  } catch (error) { next(error); }
};

export const registerProviderHandler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const result = await authService.registerProvider(req.body);
    sendSuccess(res, result.message, { providerId: result.providerId }, 201);
  } catch (error) { next(error); }
};

export const verifyOTPHandler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const { email, otp, userType } = req.body;
    let result;
    if (userType === 'provider') {
      result = await authService.verifyProviderOTP(email, otp);
    } else {
      result = await authService.verifyCustomerOTP(email, otp);
    }

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccess(res, 'Verified successfully', {
      accessToken: result.accessToken,
      user: (result as any).user || (result as any).provider
    });
  } catch (error) { next(error); }
};

export const loginCustomerHandler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginCustomer(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccess(res, 'Login successful', {
      accessToken: result.accessToken,
      user: result.user
    });
  } catch (error) { next(error); }
};

export const loginProviderHandler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginProvider(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccess(res, 'Login successful', {
      accessToken: result.accessToken,
      user: result.provider
    });
  } catch (error) { next(error); }
};

export const loginAdminHandler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginAdmin(email, password);
    sendSuccess(res, 'Admin login successful', result);
  } catch (error) { next(error); }
};

export const resendOTPHandler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const { email, userType } = req.body;
    const result = await authService.resendOTP(email, userType);
    sendSuccess(res, result.message);
  } catch (error) { next(error); }
};

export const refreshTokenHandler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userType } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }
    const result = await authService.refreshAccessToken(refreshToken, userType);
    sendSuccess(res, 'Token refreshed', result);
  } catch (error) { next(error); }
};

export const logoutHandler = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId, userType } = req.body;
    if (refreshToken && userId) {
      await authService.logout(userId, refreshToken, userType);
    }
    res.clearCookie('refreshToken');
    sendSuccess(res, 'Logged out successfully');
  } catch (error) { next(error); }
};