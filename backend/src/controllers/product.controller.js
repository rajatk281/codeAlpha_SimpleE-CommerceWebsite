const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const productService = require('../services/product.service');
const { buildPaginationParams, buildPaginationMeta } = require('../helpers/pagination');

const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPaginationParams(req.query);
  const { search, category, minPrice, maxPrice, featured, inStock, sort } = req.query;

  const { products, total } = await productService.getProducts({
    page, limit, skip, search, category, minPrice, maxPrice, featured, inStock, sort,
  });

  const pagination = buildPaginationMeta(page, limit, total);

  ApiResponse.paginated(res, 'Products fetched successfully', products, pagination);
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  ApiResponse.success(res, 'Product fetched successfully', product);
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const products = await productService.getFeaturedProducts(limit);
  ApiResponse.success(res, 'Featured products fetched successfully', products);
});

const getRelatedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 4;
  const products = await productService.getRelatedProducts(req.params.slug, limit);
  ApiResponse.success(res, 'Related products fetched successfully', products);
});

module.exports = { getProducts, getProductBySlug, getFeaturedProducts, getRelatedProducts };
