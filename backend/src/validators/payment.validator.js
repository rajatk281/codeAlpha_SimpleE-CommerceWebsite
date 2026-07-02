const Joi = require('joi');

const createPaymentOrderSchema = Joi.object({
  amount: Joi.number().positive().required()
    .messages({ 'number.base': 'Amount is required', 'number.positive': 'Amount must be positive' }),
});

const verifyPaymentSchema = Joi.object({
  razorpayOrderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),
});

module.exports = { createPaymentOrderSchema, verifyPaymentSchema };
