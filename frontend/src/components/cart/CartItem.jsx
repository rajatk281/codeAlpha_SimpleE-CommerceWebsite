import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="glass-card p-4 flex gap-4">
      <Link to={`/products/${item.slug}`} className="shrink-0">
        <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover" loading="lazy" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.slug}`} className="text-sm font-medium text-text-primary hover:text-accent transition-colors line-clamp-2">{item.name}</Link>
        {item.category && <p className="text-xs text-text-secondary mt-0.5">{item.category.name}</p>}
        <p className="text-accent font-bold mt-1">{formatCurrency(item.price)}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-secondary hover:text-accent transition-colors">
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-secondary hover:text-accent transition-colors disabled:opacity-30">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{formatCurrency(item.total)}</span>
            <button onClick={() => removeItem(item.id)} className="text-text-secondary hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
