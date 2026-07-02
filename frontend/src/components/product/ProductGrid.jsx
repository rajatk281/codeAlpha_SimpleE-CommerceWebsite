import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { PackageOpen } from 'lucide-react';

const ProductGrid = ({ products = [], loading = false }) => {
  if (!loading && products.length === 0) {
    return <EmptyState icon={PackageOpen} title="No products found" message="Try adjusting your search or filters to find what you're looking for." />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
