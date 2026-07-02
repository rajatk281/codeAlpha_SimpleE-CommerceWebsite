import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl sm:text-9xl font-display font-bold gradient-text opacity-50 mb-4">404</h1>
      <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">Page Not Found</h2>
      <p className="text-text-secondary max-w-md mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </motion.div>
  );
};

export default NotFoundPage;
