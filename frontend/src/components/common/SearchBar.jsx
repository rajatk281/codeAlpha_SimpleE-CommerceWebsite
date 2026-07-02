import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search premium coffees, teas..."
        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface/60 border border-white/5 text-sm text-text-primary placeholder-text-secondary/50 focus:border-accent focus:outline-none focus:ring-0 transition-colors"
      />
      {query && (
        <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent">
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
