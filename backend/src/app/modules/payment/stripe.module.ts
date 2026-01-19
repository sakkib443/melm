// ===================================================================
// Stripe Payment Integration - Quick Implementation
// ===================================================================

import Stripe from 'stripe';
import config from '../../config';
import { Order } from '../order/order.module';
import AppError from '../../utils/AppError';
import express from 'express';
import { authMiddleware } from '../../middlewares/auth';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2024-12-18.acacia'
});

export const StripeService = {
    async createPaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            metadata,
            automatic_payment_methods: { enabled: true }
        });
        return paymentIntent;
    },

    async confirmPayment(paymentIntentId: string, orderId: string) {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'completed',
                transactionId: paymentIntentId
            });
            return { success: true, paymentIntent };
        }
        throw new AppError(400, 'Payment not completed');
    },

    async handleWebhook(signature: string, payload: any) {
        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET || ''
            );

            if (event.type === 'payment_intent.succeeded') {
                const paymentIntent: any = event.data.object;
                const orderId = paymentIntent.metadata.orderId;

                await Order.findByIdAndUpdate(orderId, {
                    paymentStatus: 'completed',
                    transactionId: paymentIntent.id
                });
            }

            return { received: true };
        } catch (err: any) {
            throw new AppError(400, `Webhook Error: ${err.message}`);
        }
    }
};

// Routes
const router = express.Router();

router.post('/create-payment-intent', authMiddleware, catchAsync(async (req, res) => {
    const { amount, orderId } = req.body;
    const paymentIntent = await StripeService.createPaymentIntent(amount, 'usd', { orderId });
    sendResponse(res, { statusCode: 200, success: true, message: 'Payment intent created', data: { clientSecret: paymentIntent.client_secret } });
}));

router.post('/confirm', authMiddleware, catchAsync(async (req, res) => {
    const { paymentIntentId, orderId } = req.body;
    const result = await StripeService.confirmPayment(paymentIntentId, orderId);
    sendResponse(res, { statusCode: 200, success: true, message: 'Payment confirmed', data: result });
}));

router.post('/webhook', express.raw({ type: 'application/json' }), catchAsync(async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const result = await StripeService.handleWebhook(sig, req.body);
    res.json(result);
}));

export const StripeRoutes = router;
