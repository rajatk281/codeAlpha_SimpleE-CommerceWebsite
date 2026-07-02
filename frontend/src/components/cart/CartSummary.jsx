import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';

const CartSummary = ({ cart, showCheckout = true }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-display font-semibold mb-4">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal ({cart.totalItems} items)</span>
          <span>{formatCurrency(cart.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Shipping</span>
          <span className="text-green-400">Free</span>
        </div>
        <div className="border-t border-white/5 pt-3 flex justify-between font-semibold text-base">
          <span>Total</span>
          <span className="text-accent">{formatCurrency(cart.totalAmount)}</span>
        </div>
      </div>
      {showCheckout && (
        <Link to="/checkout" className="btn-primary w-full text-center mt-6 block">Proceed to Checkout</Link>
      )}
    </div>
  );
};

export default CartSummary;
