import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C67C4E', '#F5E9DA', '#4ADE80']
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="glass-card p-8 md:p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2">Payment Successful!</h1>
        <p className="text-text-secondary mb-8">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        <div className="flex flex-col gap-3">
          <Link to={`/orders/${orderId}`} className="btn-primary w-full">View Order Details</Link>
          <Link to="/products" className="btn-secondary w-full">Continue Shopping</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccessPage;
