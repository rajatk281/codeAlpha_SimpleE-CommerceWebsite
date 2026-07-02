const crypto = require('crypto');
const { getRazorpayInstance } = require('../config/razorpay');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

class PaymentService {
  async createRazorpayOrder(amount, currency = 'INR', receipt) {
    const razorpay = getRazorpayInstance();

    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return order;
  }

  verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpaySignature;

    if (!isValid) {
      throw ApiError.badRequest('Payment verification failed. Invalid signature.');
    }

    return true;
  }

  async getPaymentDetails(paymentId) {
    const razorpay = getRazorpayInstance();
    return razorpay.payments.fetch(paymentId);
  }
}

module.exports = new PaymentService();
