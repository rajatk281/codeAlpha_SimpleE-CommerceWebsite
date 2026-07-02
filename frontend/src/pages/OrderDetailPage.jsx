import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import orderAPI from '../services/order.service';
import paymentAPI from '../services/payment.service';
import { formatCurrency } from '../utils/formatCurrency';
import OrderTimeline from '../components/order/OrderTimeline';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrderById(id);
        setOrder(res.data.data);
      } catch (err) {
        toast.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleDownloadInvoice = async () => {
    try {
      const res = await orderAPI.downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Failed to download invoice');
    }
  };

  const handleRetryPayment = async () => {
    try {
      setPaymentLoading(true);
      const rzpOrderRes = await paymentAPI.createOrder(order.total);
      const { orderId: rzpOrderId, amount, currency, keyId } = rzpOrderRes.data.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'LUXE BREW',
        description: `Retry Payment for Order #${order.orderNumber}`,
        order_id: rzpOrderId,
        handler: async function (response) {
          try {
            await paymentAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            window.location.reload();
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        theme: { color: '#C67C4E' },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container py-12">
      <Link to="/orders" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Order #{order.orderNumber}</h1>
          <p className="text-text-secondary mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-3">
          {order.payment?.status === 'FAILED' && order.status !== 'CANCELLED' && (
            <Button onClick={handleRetryPayment} loading={paymentLoading} className="gap-2">
              <CreditCard className="w-4 h-4" /> Retry Payment
            </Button>
          )}
          {order.payment?.status === 'PAID' && (
            <Button variant="secondary" onClick={handleDownloadInvoice} className="gap-2">
              <Download className="w-4 h-4" /> Invoice
            </Button>
          )}
        </div>
      </div>

      <OrderTimeline currentStatus={order.status} />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4">Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.productImage} alt={item.productName} className="w-16 h-16 rounded-xl object-cover" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product?.slug}`} className="font-medium hover:text-accent line-clamp-1">{item.productName}</Link>
                    <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold mb-3">Shipping Address</h3>
              <div className="text-sm text-text-secondary space-y-1">
                <p className="font-medium text-text-primary">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold mb-3">Payment Info</h3>
              <div className="text-sm text-text-secondary space-y-2">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium text-text-primary">{order.payment?.method || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`font-medium ${order.payment?.status === 'PAID' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {order.payment?.status || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="glass-card p-6 sticky top-24">
            <h3 className="font-display font-semibold mb-4">Summary</h3>
            <div className="space-y-3 text-sm border-b border-white/5 pb-4 mb-4">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-accent">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailPage;
