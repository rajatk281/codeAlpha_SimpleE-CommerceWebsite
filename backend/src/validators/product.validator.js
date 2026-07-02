const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().min(10).required(),
  price: Joi.number().positive().precision(2).required(),
  compareAtPrice: Joi.number().positive().precision(2).allow(null).optional(),
  image: Joi.string().uri().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  categoryId: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  featured: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).optional(),
  description: Joi.string().trim().min(10).optional(),
  price: Joi.number().positive().precision(2).optional(),
  compareAtPrice: Joi.number().positive().precision(2).allow(null).optional(),
  image: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  categoryId: Joi.string().optional(),
  stock: Joi.number().integer().min(0).optional(),
  featured: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  search: Joi.string().trim().max(200).optional(),
  category: Joi.string().trim().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  featured: Joi.string().valid('true', 'false').optional(),
  inStock: Joi.string().valid('true', 'false').optional(),
  sort: Joi.string().valid('price_asc', 'price_desc', 'newest', 'featured').optional(),
});

module.exports = { createProductSchema, updateProductSchema, productQuerySchema };
