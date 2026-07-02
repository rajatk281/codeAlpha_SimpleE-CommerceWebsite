const Joi = require('joi');

const idParamSchema = Joi.object({
  id: Joi.string().required().messages({ 'string.empty': 'ID is required' }),
});

const slugParamSchema = Joi.object({
  slug: Joi.string().required().messages({ 'string.empty': 'Slug is required' }),
});

const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  search: Joi.string().trim().max(200).optional(),
  status: Joi.string().optional(),
});

const categorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().optional().allow('', null),
  image: Joi.string().uri().optional().allow('', null),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().optional().allow('', null),
  image: Joi.string().uri().optional().allow('', null),
}).min(1);

module.exports = { idParamSchema, slugParamSchema, paginationQuerySchema, categorySchema, updateCategorySchema };
