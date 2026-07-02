const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');

class CartService {
  async getCart(userId) {
    const cart = await cartRepository.findOrCreateCart(userId);
    return this.formatCart(cart);
  }

  async addItem(userId, productId, quantity = 1) {
    const [product, cart] = await Promise.all([
      productRepository.findById(productId),
      cartRepository.findByUserId(userId)
    ]);

    if (!product) throw ApiError.notFound('Product not found.');
    if (!product.isActive) throw ApiError.badRequest('This product is currently unavailable.');
    if (product.stock < quantity) throw ApiError.badRequest(`Only ${product.stock} items available.`);

    let cartId;
    let existingItem;

    if (!cart) {
      const newCart = await cartRepository.createLeanCart(userId);
      cartId = newCart.id;
    } else {
      cartId = cart.id;
      existingItem = cart.items.find(i => i.productId === productId);
    }

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw ApiError.badRequest(`Cannot add more. Only ${product.stock} items available.`);
      }
    }

    const upsertedItem = await cartRepository.addItem(cartId, productId, quantity);

    if (cart) {
      const idx = cart.items.findIndex(i => i.productId === productId);
      if (idx > -1) {
        cart.items[idx] = upsertedItem;
      } else {
        cart.items.unshift(upsertedItem);
      }
      return this.formatCart(cart);
    } else {
      return this.formatCart({ items: [upsertedItem] });
    }
  }

  async updateItemQuantity(userId, itemId, quantity) {
    const cartItem = await cartRepository.findCartItemById(itemId);
    if (!cartItem) {
      throw ApiError.notFound('Cart item not found.');
    }

    if (cartItem.cart.userId !== userId) {
      throw ApiError.forbidden('Access denied.');
    }

    if (quantity > cartItem.product.stock) {
      throw ApiError.badRequest(`Only ${cartItem.product.stock} items available in stock.`);
    }

    if (quantity <= 0) {
      await cartRepository.removeItem(itemId);
    } else {
      await cartRepository.updateItemQuantity(itemId, quantity);
    }

    const updatedCart = await cartRepository.findByUserId(userId);
    return this.formatCart(updatedCart);
  }

  async removeItem(userId, itemId) {
    const cartItem = await cartRepository.findCartItemById(itemId);
    if (!cartItem) {
      throw ApiError.notFound('Cart item not found.');
    }

    if (cartItem.cart.userId !== userId) {
      throw ApiError.forbidden('Access denied.');
    }

    await cartRepository.removeItem(itemId);

    const updatedCart = await cartRepository.findByUserId(userId);
    return this.formatCart(updatedCart);
  }

  async clearCart(userId) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      throw ApiError.notFound('Cart not found.');
    }

    await cartRepository.clearCart(cart.id);

    const updatedCart = await cartRepository.findByUserId(userId);
    return this.formatCart(updatedCart);
  }

  formatCart(cart) {
    if (!cart) return { items: [], totalItems: 0, totalAmount: 0 };

    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      compareAtPrice: item.product.compareAtPrice ? Number(item.product.compareAtPrice) : null,
      image: item.product.image,
      category: item.product.category,
      stock: item.product.stock,
      quantity: item.quantity,
      total: Number(item.product.price) * item.quantity,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    return { items, totalItems, totalAmount };
  }
}

module.exports = new CartService();
