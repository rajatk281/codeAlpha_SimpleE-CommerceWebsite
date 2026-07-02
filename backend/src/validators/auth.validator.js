const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({ 'string.empty': 'Name is required', 'string.min': 'Name must be at least 2 characters' }),
  email: Joi.string().trim().email().required()
    .messages({ 'string.empty': 'Email is required', 'string.email': 'Please provide a valid email' }),
  password: Joi.string().min(6).max(128).required()
    .messages({ 'string.empty': 'Password is required', 'string.min': 'Password must be at least 6 characters' }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({ 'string.empty': 'Email is required', 'string.email': 'Please provide a valid email' }),
  password: Joi.string().required()
    .messages({ 'string.empty': 'Password is required' }),
});

module.exports = { registerSchema, loginSchema };
