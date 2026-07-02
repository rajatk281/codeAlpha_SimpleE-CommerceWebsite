import { createContext, useState, useEffect, useCallback } from 'react';
import cartAPI from '../services/cart.service';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
      return;
    }

    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      setCart(res.data.data);
    } catch {
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    try {
      const res = await cartAPI.addItem(productId, quantity);
      setCart(res.data.data);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
      throw err;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartAPI.updateQuantity(itemId, quantity);
      setCart(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
      throw err;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await cartAPI.removeItem(itemId);
      setCart(res.data.data);
      toast.success('Item removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartAPI.clearCart();
      setCart(res.data.data);
      toast.success('Cart cleared');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const resetCart = () => {
    setCart({ items: [], totalItems: 0, totalAmount: 0 });
  };

  const value = {
    cart,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
    resetCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
