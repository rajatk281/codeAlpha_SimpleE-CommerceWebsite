const prisma = require('../lib/prisma');

class CartRepository {
  async findByUserId(userId) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: { select: { id: true, name: true, slug: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findLeanCart(userId, productId) {
    return prisma.cart.findUnique({
      where: { userId },
      select: { id: true, items: { where: { productId }, select: { quantity: true } } }
    });
  }

  async createLeanCart(userId) {
    return prisma.cart.create({ data: { userId }, select: { id: true } });
  }

  async findOrCreateCart(userId) {
    let cart = await this.findByUserId(userId);
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: { select: { id: true, name: true, slug: true } },
                },
              },
            },
          },
        },
      });
    }
    return cart;
  }

  async addItem(cartId, productId, quantity = 1) {
    return prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId, productId },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  }

  async updateItemQuantity(itemId, quantity) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  }

  async removeItem(itemId) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clearCart(cartId) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }

  async findCartItemById(itemId) {
    return prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });
  }
}

module.exports = new CartRepository();
