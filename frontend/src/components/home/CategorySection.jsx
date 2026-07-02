import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data?.data || []);
      } catch {}
    };
    fetch();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-secondary/50">
      <div className="page-container">
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-medium uppercase tracking-widest">Browse By</span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold mt-2">Categories</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/products?category=${cat.slug}`} className="group block glass-card overflow-hidden card-hover">
                <div className="aspect-square overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{cat.name}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{cat._count?.products || 0} items</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
