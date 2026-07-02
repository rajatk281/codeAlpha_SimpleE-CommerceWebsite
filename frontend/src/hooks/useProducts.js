import { useState, useEffect, useCallback } from 'react';
import productAPI from '../services/product.service';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const allParams = { ...initialParams, ...params };
      const cleanParams = Object.fromEntries(
        Object.entries(allParams).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
      const res = await productAPI.getProducts(cleanParams);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, pagination, loading, error, fetchProducts };
};
