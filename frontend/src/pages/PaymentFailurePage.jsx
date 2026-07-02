import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const PaymentFailurePage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="glass-card p-8 md:p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2 text-text-primary">Payment Failed</h1>
        <p className="text-text-secondary mb-8">
          We couldn't process your payment. Please try again or use a different payment method.
        </p>
        <div className="flex flex-col gap-3">
          <Link to={`/orders/${orderId}`} className="btn-primary w-full">View Order & Retry Payment</Link>
          <Link to="/contact" className="btn-secondary w-full">Contact Support</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentFailurePage;
