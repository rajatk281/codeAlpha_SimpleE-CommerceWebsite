import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, CheckCircle2, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import productAPI from '../services/product.service';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { isAuthenticated } = useAuth();
  const { addItem, cart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getProductBySlug(slug);
        setProduct(res.data.data);
        setActiveImage(0);
        setQuantity(1);
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug, navigate]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const inCart = cart.items.find(i => i.productId === product.id);
  const maxAllowed = Math.min(product.stock, 5); // Max 5 per order

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await addItem(product.id, quantity);
    } catch {}
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (inWishlist) await removeFromWishlist(product.id);
    else await addToWishlist(product.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-8">
        <ChevronLeft className="w-5 h-5" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden glass-card border border-white/5">
            <img src={allImages[activeImage]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span className="text-accent text-sm font-medium uppercase tracking-widest">{product.category.name}</span>
          )}
          <h1 className="text-3xl sm:text-4xl font-display font-bold mt-2 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
            <span className="text-3xl font-bold text-accent">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
              <span className="text-xl text-text-secondary line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
            {isOutOfStock ? (
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider ml-auto">Out of Stock</span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 ml-auto">
                <CheckCircle2 className="w-3 h-3" /> In Stock
              </span>
            )}
          </div>

          <p className="text-text-secondary leading-relaxed mb-8">{product.description}</p>

          {!isOutOfStock && (
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center gap-1 bg-surface/60 rounded-xl p-1 border border-white/5">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:text-accent hover:bg-white/5 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(maxAllowed, q + 1))}
                  disabled={quantity >= maxAllowed}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:text-accent hover:bg-white/5 transition-colors disabled:opacity-30"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-text-secondary ml-2">Max {maxAllowed} per order</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {!isOutOfStock && (
              <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2 text-lg">
                <ShoppingCart className="w-5 h-5" />
                {inCart ? 'Add More to Cart' : 'Add to Cart'}
              </Button>
            )}
            <div className="flex gap-4">
              <Button onClick={handleWishlist} variant="secondary" size="lg" className={`px-6 ${inWishlist ? 'text-red-400 border-red-400/30' : ''}`}>
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </Button>
              <Button onClick={handleShare} variant="secondary" size="lg" className="px-6">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Free Delivery</h4>
                <p className="text-xs text-text-secondary">On all orders above ₹999. Usually delivers in 3-5 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Secure Checkout</h4>
                <p className="text-xs text-text-secondary">Encrypted payments powered by Razorpay.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
