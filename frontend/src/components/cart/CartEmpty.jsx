import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../common/EmptyState';

const CartEmpty = () => {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Your cart is empty"
      message="Looks like you haven't added anything to your cart yet. Explore our collection to find something you love."
      action={<Link to="/products" className="btn-primary">Start Shopping</Link>}
    />
  );
};

export default CartEmpty;
