const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const wishlistService = require('../services/wishlist.service');

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);
  ApiResponse.success(res, 'Wishlist fetched successfully', wishlist);
});

const addToWishlist = asyncHandler(async (req, res) => {
  const item = await wishlistService.addToWishlist(req.user.id, req.body.productId);
  ApiResponse.created(res, 'Added to wishlist', item);
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
  ApiResponse.success(res, 'Removed from wishlist');
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
