import React, { createContext, useState, useEffect, useCallback } from 'react';
import wishlistAPI from '../services/wishlist.service';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistAPI.getWishlist();
      setWishlist(res.data.data);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    try {
      const res = await wishlistAPI.addToWishlist(productId);
      setWishlist((prev) => [res.data.data, ...prev]);
      toast.success('Added to wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId || item.product?.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
