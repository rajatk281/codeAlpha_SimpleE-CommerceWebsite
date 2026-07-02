const wishlistRepository = require('../repositories/wishlist.repository');
const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');

class WishlistService {
  async getWishlist(userId) {
    return wishlistRepository.findByUserId(userId);
  }

  async addToWishlist(userId, productId) {
    try {
      return await wishlistRepository.add(userId, productId);
    } catch (error) {
      if (error.code === 'P2002') {
        throw ApiError.conflict('Product is already in your wishlist.');
      }
      if (error.code === 'P2003') {
        throw ApiError.notFound('Product not found.');
      }
      throw error;
    }
  }

  async removeFromWishlist(userId, productId) {
    const exists = await wishlistRepository.exists(userId, productId);
    if (!exists) {
      throw ApiError.notFound('Product not found in your wishlist.');
    }

    await wishlistRepository.remove(userId, productId);
    return { message: 'Product removed from wishlist.' };
  }
}

module.exports = new WishlistService();
