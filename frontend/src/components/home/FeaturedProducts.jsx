import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import productAPI from '../../services/product.service';
import ProductCard from '../product/ProductCard';
import ProductCardSkeleton from '../product/ProductCardSkeleton';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productAPI.getFeaturedProducts(8);
        setProducts(res.data?.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <section className="py-16 lg:py-24">
      <div className="page-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-accent text-sm font-medium uppercase tracking-widest">Curated Selection</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mt-2">Featured Products</h2>
          </div>
          <Link to="/products?featured=true" className="hidden sm:flex items-center gap-2 text-sm text-accent hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)
          }
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link to="/products?featured=true" className="btn-secondary text-sm">View All Products</Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
