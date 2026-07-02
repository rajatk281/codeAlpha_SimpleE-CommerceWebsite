import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); return; }
    if (isOutOfStock) return;
    try { await addItem(product.id); } catch {}
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to use wishlist'); return; }
    if (inWishlist) { await removeFromWishlist(product.id); } else { await addToWishlist(product.id); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/products/${product.slug}`} className="group block">
        <div className="glass-card overflow-hidden card-hover">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.featured && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-white">Featured</span>
              )}
              {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white">
                  {Math.round((1 - Number(product.price) / Number(product.compareAtPrice)) * 100)}% Off
                </span>
              )}
              {isOutOfStock && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/90 text-white">Out of Stock</span>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={handleWishlist}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${inWishlist ? 'bg-red-500 text-white' : 'bg-black/40 backdrop-blur-sm text-white hover:bg-accent'}`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
              {!isOutOfStock && (
                <button
                  onClick={handleAddToCart}
                  className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-accent flex items-center justify-center transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {product.category && (
              <p className="text-[11px] uppercase tracking-wider text-accent font-medium mb-1">{product.category.name}</p>
            )}
            <h3 className="font-medium text-text-primary text-sm leading-snug line-clamp-2 mb-2 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-accent">{formatCurrency(product.price)}</span>
              {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                <span className="text-sm text-text-secondary line-through">{formatCurrency(product.compareAtPrice)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
