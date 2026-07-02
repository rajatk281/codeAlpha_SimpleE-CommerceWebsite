import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(198,124,78,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(198,124,78,0.1) 0%, transparent 50%)' }} />

      <div className="page-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-[2px] bg-accent" />
              <span className="text-accent text-sm font-medium uppercase tracking-widest">Premium Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] mb-6">
              Elevate Your
              <br />
              <span className="gradient-text">Daily Ritual</span>
            </h1>

            <p className="text-text-secondary text-lg max-w-lg mb-8 leading-relaxed">
              Discover single-origin coffees, exquisite teas, and artisan brewing equipment. Curated from the world's finest estates.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products?featured=true" className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-4">
                <Coffee className="w-5 h-5" /> Featured
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[{ value: '50+', label: 'Premium Products' }, { value: '10K+', label: 'Happy Customers' }, { value: '4.9', label: 'Avg Rating' }].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-display font-bold text-accent">{stat.value}</p>
                  <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
                alt="Premium Coffee"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
              />
              {/* Floating card */}
              <motion.div
                className="absolute -bottom-4 -left-4 glass-card p-4 z-20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-text-secondary">Orders above ₹999</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
