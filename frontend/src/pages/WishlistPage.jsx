import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/product/ProductCard';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WishlistPage = () => {
  const { wishlist, loading } = useWishlist();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container py-12">
      <h1 className="text-3xl font-display font-bold mb-8">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Save your favorite items here to review them later."
          action={<Link to="/products" className="btn-primary">Explore Products</Link>}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WishlistPage;
