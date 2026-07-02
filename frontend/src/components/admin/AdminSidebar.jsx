import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, FolderOpen, Coffee, LogOut, Menu, X, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: ShoppingBag, label: 'Products' },
  { to: '/admin/orders', icon: Package, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/categories', icon: FolderOpen, label: 'Categories' },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Mobile Toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 left-4 z-[70] w-10 h-10 rounded-xl glass flex items-center justify-center">
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-[55]" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-secondary border-r border-white/5 z-[60] transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <Link to="/" className="flex items-center gap-2">
              <Coffee className="w-6 h-6 text-accent" />
              <span className="font-display font-bold gradient-text">LUXE BREW</span>
            </Link>
            <p className="text-xs text-text-secondary mt-1">Admin Panel</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to || (link.to !== '/admin' && location.pathname.startsWith(link.to));
              return (
                <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${isActive ? 'gradient-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}>
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5 space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
              <ChevronLeft className="w-5 h-5" /> Back to Store
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full text-left">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
