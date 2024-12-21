import express from 'express';
import { createSettlement, handlePaymentWebhook } from '../controllers/settlement.controller';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/settlements', authenticateUser, createSettlement);
router.post('/settlements/webhook', handlePaymentWebhook);

export default router;