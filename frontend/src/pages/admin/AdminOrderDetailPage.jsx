import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import adminAPI from '../../services/admin.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUS_COLORS } from '../../constants';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await adminAPI.getOrderDetail(id);
      setOrder(res.data.data);
    } catch (err) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleUpdateStatus = async (status) => {
    try {
      setStatusUpdating(true);
      await adminAPI.updateOrderStatus(id, status);
      toast.success('Order status updated');
      await fetchOrder();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return null;

  return (
    <div className="max-w-4xl">
      <Link to="/admin/orders" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Order #{order.orderNumber}</h1>
          <p className="text-text-secondary mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">Update Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            disabled={statusUpdating || order.status === 'CANCELLED' || order.status === 'DELIVERED'}
            className="input-field py-2 pr-10 text-sm w-40"
          >
            {Object.keys(ORDER_STATUS_COLORS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Customer Details</h3>
          <div className="text-sm space-y-2">
            <p><span className="text-text-secondary w-20 inline-block">Name:</span> {order.user?.name}</p>
            <p><span className="text-text-secondary w-20 inline-block">Email:</span> {order.user?.email}</p>
            <p><span className="text-text-secondary w-20 inline-block">Phone:</span> {order.shippingAddress?.phone}</p>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Payment Details</h3>
          <div className="text-sm space-y-2">
            <p><span className="text-text-secondary w-20 inline-block">Method:</span> {order.payment?.method || 'N/A'}</p>
            <p><span className="text-text-secondary w-20 inline-block">Status:</span> <span className={order.payment?.status === 'PAID' ? 'text-green-400' : 'text-yellow-400'}>{order.payment?.status}</span></p>
            {order.payment?.razorpayPaymentId && (
              <p><span className="text-text-secondary w-20 inline-block">Txn ID:</span> {order.payment.razorpayPaymentId}</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Order Items</h3>
        <div className="space-y-4 divide-y divide-white/5">
          {order.items.map((item) => (
            <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded object-cover" loading="lazy" />
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-text-secondary">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                </div>
              </div>
              <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-accent">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
