// ===================================================================
// SSLCommerz Payment Integration - Bangladesh
// ===================================================================

import axios from 'axios';
import { Order } from '../order/order.module';
import AppError from '../../utils/AppError';
import express from 'express';
import { authMiddleware } from '../../middlewares/auth';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const SSLCOMMERZ_CONFIG = {
    store_id: process.env.SSLCOMMERZ_STORE_ID || 'test_store',
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD || 'test_password',
    is_live: process.env.NODE_ENV === 'production',
    api_url: process.env.NODE_ENV === 'production'
        ? 'https://securepay.sslcommerz.com'
        : 'https://sandbox.sslcommerz.com'
};

export const SSLCommerzService = {
    async initiatePayment(orderData: any) {
        const data = {
            store_id: SSLCOMMERZ_CONFIG.store_id,
            store_passwd: SSLCOMMERZ_CONFIG.store_passwd,
            total_amount: orderData.amount,
            currency: 'BDT',
            tran_id: orderData.transactionId,
            success_url: `${process.env.BACKEND_URL}/api/sslcommerz/success`,
            fail_url: `${process.env.BACKEND_URL}/api/sslcommerz/fail`,
            cancel_url: `${process.env.BACKEND_URL}/api/sslcommerz/cancel`,
            ipn_url: `${process.env.BACKEND_URL}/api/sslcommerz/ipn`,
            cus_name: orderData.customerName,
            cus_email: orderData.customerEmail,
            cus_phone: orderData.customerPhone || '01700000000',
            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_country: 'Bangladesh',
            shipping_method: 'NO',
            product_name: orderData.productName,
            product_category: 'Digital',
            product_profile: 'general'
        };

        const response = await axios.post(`${SSLCOMMERZ_CONFIG.api_url}/gwprocess/v4/api.php`, data);

        if (response.data.status === 'SUCCESS') {
            return { gatewayUrl: response.data.GatewayPageURL };
        }
        throw new AppError(400, 'Payment initiation failed');
    },

    async validatePayment(transactionId: string) {
        const response = await axios.get(
            `${SSLCOMMERZ_CONFIG.api_url}/validator/api/validationserverAPI.php`,
            {
                params: {
                    val_id: transactionId,
                    store_id: SSLCOMMERZ_CONFIG.store_id,
                    store_passwd: SSLCOMMERZ_CONFIG.store_passwd
                }
            }
        );

        if (response.data.status === 'VALID' || response.data.status === 'VALIDATED') {
            return { valid: true, data: response.data };
        }
        return { valid: false };
    }
};

// Routes
const router = express.Router();

router.post('/init', authMiddleware, catchAsync(async (req, res) => {
    const result = await SSLCommerzService.initiatePayment(req.body);
    sendResponse(res, { statusCode: 200, success: true, message: 'Payment initiated', data: result });
}));

router.post('/success', catchAsync(async (req, res) => {
    const { tran_id, val_id } = req.body;
    const validation = await SSLCommerzService.validatePayment(val_id);

    if (validation.valid) {
        await Order.findOneAndUpdate(
            { transactionId: tran_id },
            { paymentStatus: 'completed' }
        );
        res.redirect(`${process.env.FRONTEND_URL}/payment/success?tran_id=${tran_id}`);
    } else {
        res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }
}));

router.post('/fail', catchAsync(async (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
}));

router.post('/cancel', catchAsync(async (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancelled`);
}));

export const SSLCommerzRoutes = router;
