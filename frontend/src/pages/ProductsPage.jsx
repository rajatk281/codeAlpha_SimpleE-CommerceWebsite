import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import ProductSort from '../components/product/ProductSort';
import Pagination from '../components/common/Pagination';
import { useProducts } from '../hooks/useProducts';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, loading, error, fetchProducts } = useProducts();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    featured: searchParams.get('featured') || '',
    inStock: searchParams.get('inStock') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page'), 10) || 1,
  });

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateSearchParams(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '', category: '', minPrice: '', maxPrice: '', featured: '', inStock: '', sort: 'newest', page: 1
    };
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold">
          {filters.search ? `Search Results for "${filters.search}"` : 'All Products'}
        </h1>
        <p className="text-text-secondary mt-2">
          {pagination ? `Showing ${products.length} of ${pagination.totalItems} products` : 'Loading products...'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0">
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} onClear={clearFilters} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-end mb-6">
            <ProductSort value={filters.sort} onChange={(val) => handleFilterChange('sort', val)} />
          </div>

          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6">{error}</div>}

          <ProductGrid products={products} loading={loading} />

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsPage;
