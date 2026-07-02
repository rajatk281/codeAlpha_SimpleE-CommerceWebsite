const prisma = require('../lib/prisma');

class ProductRepository {
  async findAll({ skip, limit, where, orderBy }) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findBySlug(slug) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findFeatured(limit = 8) {
    return prisma.product.findMany({
      where: { featured: true, isActive: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findRelated(productId, categoryId, limit = 4) {
    return prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        id: { not: productId },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async create(data) {
    return prisma.product.create({
      data,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async update(id, data) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async delete(id) {
    return prisma.product.delete({ where: { id } });
  }

  async updateStock(id, quantity) {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }

  async count(where = {}) {
    return prisma.product.count({ where });
  }

  async getLowStockProducts(threshold = 5) {
    return prisma.product.findMany({
      where: { stock: { lte: threshold }, isActive: true },
      orderBy: { stock: 'asc' },
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }
}

module.exports = new ProductRepository();
