import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import productAPI from '../../services/product.service';

const ProductFilters = ({ filters, onFilterChange, onClear }) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await (await import('../../services/api')).default.get('/categories');
        setCategories(res.data.data);
      } catch {}
    };
    fetchCategories();
  }, []);

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.featured || filters.inStock;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Category</h4>
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange('category', '')}
            className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!filters.category ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange('category', cat.slug)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${filters.category === cat.slug ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}
            >
              {cat.name}
              <span className="text-xs text-text-secondary ml-1">({cat._count?.products || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="input-field text-sm py-2 w-full"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="input-field text-sm py-2 w-full"
          />
        </div>
      </div>

      {/* Toggles */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Availability</h4>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => onFilterChange('inStock', e.target.checked ? 'true' : '')}
            className="w-4 h-4 rounded border-border text-accent focus:ring-accent bg-surface"
          />
          <span className="text-sm text-text-secondary">In Stock Only</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.featured === 'true'}
            onChange={(e) => onFilterChange('featured', e.target.checked ? 'true' : '')}
            className="w-4 h-4 rounded border-border text-accent focus:ring-accent bg-surface"
          />
          <span className="text-sm text-text-secondary">Featured Only</span>
        </label>
      </div>

      {hasActiveFilters && (
        <button onClick={onClear} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
          <X className="w-4 h-4" /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 btn-secondary text-sm py-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent" />}
        </button>

        {isOpen && (
          <div className="mt-4 glass-card p-4">
            <FilterContent />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductFilters;
