const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const cartService = require('../services/cart.service');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  ApiResponse.success(res, 'Cart fetched successfully', cart);
});

const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addItem(req.user.id, productId, quantity);
  ApiResponse.success(res, 'Item added to cart', cart);
});

const updateItemQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartService.updateItemQuantity(req.user.id, req.params.id, quantity);
  ApiResponse.success(res, 'Cart updated', cart);
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.id);
  ApiResponse.success(res, 'Item removed from cart', cart);
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  ApiResponse.success(res, 'Cart cleared', cart);
});

module.exports = { getCart, addItem, updateItemQuantity, removeItem, clearCart };
