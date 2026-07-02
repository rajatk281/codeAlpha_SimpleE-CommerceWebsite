import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, ShoppingCart, Heart, User, Menu, X, Search, LogOut, Package, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="page-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Coffee className="w-7 h-7 text-accent" />
            <span className="text-xl font-display font-bold gradient-text hidden sm:inline">LUXE BREW</span>
          </Link>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/products" className="text-sm text-text-secondary hover:text-accent transition-colors">Shop</Link>

            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="text-text-secondary hover:text-accent transition-colors relative">
                  <Heart className="w-5 h-5" />
                </Link>
                <Link to="/cart" className="text-text-secondary hover:text-accent transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cart.totalItems}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 glass-card py-2 shadow-2xl"
                      >
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                          <p className="text-xs text-text-secondary">{user?.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-accent hover:bg-white/5 transition-colors">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-accent hover:bg-white/5 transition-colors">
                          <Package className="w-4 h-4" /> Orders
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-accent hover:bg-white/5 transition-colors">
                            <Shield className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors w-full text-left">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-5 py-2.5">Sign In</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {isAuthenticated && (
              <Link to="/cart" className="text-text-secondary relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-text-secondary">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="page-container py-4 space-y-3">
              <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-text-secondary hover:text-accent transition-colors">Shop</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block py-2 text-text-secondary hover:text-accent transition-colors">Wishlist</Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-text-secondary hover:text-accent transition-colors">Orders</Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-text-secondary hover:text-accent transition-colors">Profile</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-text-secondary hover:text-accent transition-colors">Admin Panel</Link>}
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-red-400">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-accent font-medium">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
