import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Coffee className="w-8 h-8 text-accent" />
          <span className="text-2xl font-display font-bold gradient-text">LUXE BREW</span>
        </Link>
        <div className="glass-card p-8">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
