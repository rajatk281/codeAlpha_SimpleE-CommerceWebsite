import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../common/Badge';
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '../../constants';

const OrderCard = ({ order }) => {
  const statusVariant = ORDER_STATUS_COLORS[order.status] || '';

  return (
    <Link to={`/orders/${order.id}`} className="glass-card p-5 block card-hover">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-medium">Order #{order.orderNumber}</p>
          <p className="text-xs text-text-secondary mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusVariant}`}>{order.status}</span>
          {order.payment && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[order.payment.status] || ''}`}>{order.payment.status}</span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item) => (
            <img key={item.id} src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover border-2 border-secondary" loading="lazy" />
          ))}
          {order.items.length > 3 && (
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-xs text-text-secondary border-2 border-secondary">
              +{order.items.length - 3}
            </div>
          )}
        </div>
        <p className="text-lg font-bold text-accent">{formatCurrency(order.total)}</p>
      </div>
    </Link>
  );
};

export default OrderCard;
