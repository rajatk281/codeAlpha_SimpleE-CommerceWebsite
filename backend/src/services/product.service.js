const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');
const { SORT_OPTIONS } = require('../constants');

class ProductService {
  async getProducts({ page, limit, skip, search, category, minPrice, maxPrice, featured, inStock, sort }) {
    const where = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
    }

    if (featured !== undefined) {
      where.featured = featured === 'true' || featured === true;
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    let orderBy = { createdAt: 'desc' };
    switch (sort) {
      case SORT_OPTIONS.PRICE_ASC:
        orderBy = { price: 'asc' };
        break;
      case SORT_OPTIONS.PRICE_DESC:
        orderBy = { price: 'desc' };
        break;
      case SORT_OPTIONS.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
      case SORT_OPTIONS.FEATURED:
        orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
        break;
    }

    return productRepository.findAll({ skip, limit, where, orderBy });
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw ApiError.notFound('Product not found.');
    }
    return product;
  }

  async getFeaturedProducts(limit) {
    return productRepository.findFeatured(limit);
  }

  async getRelatedProducts(slug, limit) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw ApiError.notFound('Product not found.');
    }
    return productRepository.findRelated(product.id, product.categoryId, limit);
  }

  async createProduct(data) {
    const slug = this.generateSlug(data.name);
    return productRepository.create({ ...data, slug });
  }

  async updateProduct(id, data) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found.');
    }

    if (data.name && data.name !== product.name) {
      data.slug = this.generateSlug(data.name);
    }

    return productRepository.update(id, data);
  }

  async deleteProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found.');
    }
    await productRepository.delete(id);
    return product;
  }

  generateSlug(name) {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const suffix = Math.random().toString(36).substring(2, 6);
    return `${base}-${suffix}`;
  }
}

module.exports = new ProductService();
