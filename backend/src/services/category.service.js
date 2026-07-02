const categoryRepository = require('../repositories/category.repository');
const ApiError = require('../utils/ApiError');

class CategoryService {
  async getCategories() {
    return categoryRepository.findAll();
  }

  async getCategoryBySlug(slug) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw ApiError.notFound('Category not found.');
    }
    return category;
  }

  async createCategory(data) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return categoryRepository.create({ ...data, slug });
  }

  async updateCategory(id, data) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found.');
    }

    if (data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    return categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found.');
    }
    await categoryRepository.delete(id);
    return category;
  }
}

module.exports = new CategoryService();
