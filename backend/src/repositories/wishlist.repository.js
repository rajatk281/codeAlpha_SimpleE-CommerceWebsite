const prisma = require('../lib/prisma');

class WishlistRepository {
  async findByUserId(userId) {
    return prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(userId, productId) {
    return prisma.wishlistItem.create({
      data: { userId, productId },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  }

  async remove(userId, productId) {
    return prisma.wishlistItem.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  async exists(userId, productId) {
    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
    return !!item;
  }
}

module.exports = new WishlistRepository();
