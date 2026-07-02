const Joi = require('joi');

const addToCartSchema = Joi.object({
  productId: Joi.string().required().messages({ 'string.empty': 'Product ID is required' }),
  quantity: Joi.number().integer().min(1).max(10).optional().default(1),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).max(10).required()
    .messages({ 'number.base': 'Quantity must be a number' }),
});

module.exports = { addToCartSchema, updateCartItemSchema };
