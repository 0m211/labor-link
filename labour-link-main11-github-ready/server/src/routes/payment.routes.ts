import { Router } from 'express';
import {
  createOrderHandler,
  verifyPaymentHandler,
  getPaymentHistoryHandler,
  webhookHandler,
  refundHandler
} from '../controllers/payment.controller';

const router = Router();

router.post('/create-order', createOrderHandler);
router.post('/verify', verifyPaymentHandler);
router.post('/webhook', webhookHandler);
router.get('/history', getPaymentHistoryHandler);
router.post('/refund', refundHandler);

export default router;