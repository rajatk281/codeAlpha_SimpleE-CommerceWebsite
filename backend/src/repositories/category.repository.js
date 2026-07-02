const prisma = require('../lib/prisma');

class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async findBySlug(slug) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async findById(id) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async create(data) {
    return prisma.category.create({
      data,
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async update(id, data) {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async delete(id) {
    return prisma.category.delete({ where: { id } });
  }
}

module.exports = new CategoryRepository();
