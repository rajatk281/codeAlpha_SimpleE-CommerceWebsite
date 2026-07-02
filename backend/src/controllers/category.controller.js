const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const categoryService = require('../services/category.service');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();
  ApiResponse.success(res, 'Categories fetched successfully', categories);
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  ApiResponse.success(res, 'Category fetched successfully', category);
});

module.exports = { getCategories, getCategoryBySlug };
