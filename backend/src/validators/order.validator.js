const Joi = require('joi');

const createOrderSchema = Joi.object({
  shippingDetails: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().required(),
    phone: Joi.string().trim().min(10).max(15).required(),
    address: Joi.string().trim().min(5).required(),
    city: Joi.string().trim().min(2).max(100).required(),
    state: Joi.string().trim().min(2).max(100).required(),
    pincode: Joi.string().trim().min(5).max(10).required(),
  }).required(),
  razorpayOrderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),
  paymentAmount: Joi.number().positive().required(),
  couponCode: Joi.string().trim().max(50).optional().allow('', null),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED').required(),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
