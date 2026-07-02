import { Link } from 'react-router-dom';
import { Coffee, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-white/5 mt-auto">
      <div className="page-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Coffee className="w-6 h-6 text-accent" />
              <span className="text-lg font-display font-bold gradient-text">LUXE BREW</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              Premium coffee & tea curated from the world's finest estates. Elevate your daily ritual.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-text-secondary hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-text-secondary hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-text-secondary hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-sm text-text-secondary hover:text-accent transition-colors">All Products</Link></li>
              <li><Link to="/products?category=coffee-espresso" className="text-sm text-text-secondary hover:text-accent transition-colors">Coffee</Link></li>
              <li><Link to="/products?category=tea-collection" className="text-sm text-text-secondary hover:text-accent transition-colors">Tea</Link></li>
              <li><Link to="/products?category=brewing-equipment" className="text-sm text-text-secondary hover:text-accent transition-colors">Equipment</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/orders" className="text-sm text-text-secondary hover:text-accent transition-colors">Track Order</Link></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-accent transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-accent transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-accent transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4">Stay Updated</h4>
            <p className="text-sm text-text-secondary mb-4">Subscribe for exclusive offers and new arrivals.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="input-field text-sm flex-1 py-2.5" />
              <button className="btn-primary text-sm px-4 py-2.5 shrink-0">Join</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} LUXE BREW. All rights reserved. Crafted with passion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
