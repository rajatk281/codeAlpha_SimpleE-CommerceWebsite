import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import CartEmpty from '../components/cart/CartEmpty';
import Button from '../components/common/Button';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cart, clearCart } = useCart();

  if (!cart.items?.length) {
    return <CartEmpty />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Your Cart</h1>
        <Button variant="ghost" onClick={clearCart} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div>
          <div className="sticky top-24">
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
