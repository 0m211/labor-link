import { Router } from 'express';
import {
  registerCustomerHandler,
  registerProviderHandler,
  verifyOTPHandler,
  loginCustomerHandler,
  loginProviderHandler,
  loginAdminHandler,
  resendOTPHandler,
  refreshTokenHandler,
  logoutHandler
} from '../controllers/auth.controller';

const router = Router();

// Customer
router.post('/register/customer', registerCustomerHandler);
router.post('/register/provider', registerProviderHandler);
router.post('/verify-otp', verifyOTPHandler);
router.post('/resend-otp', resendOTPHandler);
router.post('/login/customer', loginCustomerHandler);
router.post('/login/provider', loginProviderHandler);
router.post('/login/admin', loginAdminHandler);
router.post('/refresh-token', refreshTokenHandler);
router.post('/logout', logoutHandler);

export default router;