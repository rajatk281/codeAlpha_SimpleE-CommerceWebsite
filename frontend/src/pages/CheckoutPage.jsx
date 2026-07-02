import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import orderAPI from '../services/order.service';
import paymentAPI from '../services/payment.service';
import ShippingForm from '../components/checkout/ShippingForm';
import OrderSummary from '../components/checkout/OrderSummary';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, resetCart } = useCart();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
    }
  });

  if (!cart.items?.length && !loading) {
    navigate('/cart');
    return null;
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // 1. Load Razorpay script
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // 2. Create Order in our backend
      const orderRes = await orderAPI.createOrder({ shippingAddress: data });
      const order = orderRes.data.data;

      // 3. Create Razorpay Order
      const rzpOrderRes = await paymentAPI.createOrder(order.total);
      const { orderId: rzpOrderId, amount, currency, keyId } = rzpOrderRes.data.data;

      // 4. Initialize Razorpay Checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'LUXE BREW',
        description: `Order #${order.orderNumber}`,
        order_id: rzpOrderId,
        handler: async function (response) {
          try {
            // 5. Verify payment
            await paymentAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            resetCart();
            navigate(`/payment/success?orderId=${order.id}`);
          } catch (err) {
            navigate(`/payment/failure?orderId=${order.id}`);
          }
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: '#C67C4E',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        navigate(`/payment/failure?orderId=${order.id}`);
      });
      paymentObject.open();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container py-12">
      <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="glass-card p-6">
            <ShippingForm register={register} errors={errors} />
          </form>
        </div>
        <div>
          <div className="sticky top-24 space-y-4">
            <OrderSummary cart={cart} />
            <Button type="submit" form="checkout-form" className="w-full" size="lg" loading={loading}>
              Place Order & Pay
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
