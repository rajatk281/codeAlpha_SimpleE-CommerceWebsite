import { formatCurrency } from '../../utils/formatCurrency';

const OrderSummary = ({ cart, couponCode }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-display font-semibold mb-4">Order Summary</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-3 py-2">
            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary line-clamp-1">{item.name}</p>
              <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium shrink-0">{formatCurrency(item.total)}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span><span>{formatCurrency(cart.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Shipping</span><span className="text-green-400">Free</span>
        </div>
        {couponCode && (
          <div className="flex justify-between text-green-400">
            <span>Coupon ({couponCode})</span><span>-₹0</span>
          </div>
        )}
        <div className="border-t border-white/5 pt-2 flex justify-between font-bold text-base">
          <span>Total</span><span className="text-accent">{formatCurrency(cart.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
