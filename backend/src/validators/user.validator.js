const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  phone: Joi.string().trim().min(10).max(20).optional().allow('', null),
  address: Joi.string().trim().optional().allow('', null),
  city: Joi.string().trim().max(100).optional().allow('', null),
  state: Joi.string().trim().max(100).optional().allow('', null),
  pincode: Joi.string().trim().max(10).optional().allow('', null),
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required()
    .messages({ 'string.empty': 'Current password is required' }),
  newPassword: Joi.string().min(6).max(128).required()
    .messages({ 'string.empty': 'New password is required', 'string.min': 'New password must be at least 6 characters' }),
});

module.exports = { updateProfileSchema, changePasswordSchema };
