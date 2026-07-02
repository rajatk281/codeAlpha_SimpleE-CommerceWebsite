const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const paymentService = require('../services/payment.service');
const env = require('../config/env');

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const order = await paymentService.createRazorpayOrder(amount);

  ApiResponse.success(res, 'Razorpay order created', {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: env.RAZORPAY_KEY_ID,
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  paymentService.verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  ApiResponse.success(res, 'Payment verified successfully', {
    razorpayOrderId,
    razorpayPaymentId,
    verified: true,
  });
});

module.exports = { createPaymentOrder, verifyPayment };
