import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategorySection from '../components/home/CategorySection';
import Newsletter from '../components/home/Newsletter';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <Newsletter />
    </motion.div>
  );
};

export default HomePage;
