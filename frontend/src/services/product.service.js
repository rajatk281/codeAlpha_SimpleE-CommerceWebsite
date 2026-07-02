import api from './api';

const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  getFeaturedProducts: (limit = 8) => api.get('/products/featured', { params: { limit } }),
  getRelatedProducts: (slug, limit = 4) => api.get(`/products/${slug}/related`, { params: { limit } }),
};

export default productAPI;
