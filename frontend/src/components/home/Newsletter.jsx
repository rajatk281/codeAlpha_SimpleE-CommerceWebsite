import { Truck, Shield, Headphones, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: Shield, title: 'Secure Payments', desc: 'Razorpay protected' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here for you' },
  { icon: Leaf, title: 'Fresh & Organic', desc: 'Premium quality beans' },
];

const Newsletter = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="page-container">
        {/* Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {features.map((f, i) => (
            <motion.div key={f.title} className="glass-card p-6 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <f.icon className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-medium text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-text-secondary">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card p-8 lg:p-12 text-center bg-gradient-to-r from-accent/5 to-transparent">
          <h3 className="text-2xl lg:text-3xl font-display font-bold mb-3">Join the LUXE BREW Community</h3>
          <p className="text-text-secondary max-w-lg mx-auto mb-6">Get exclusive offers, brewing tips, and early access to new arrivals.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="input-field flex-1" />
            <button className="btn-primary shrink-0">Subscribe</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
