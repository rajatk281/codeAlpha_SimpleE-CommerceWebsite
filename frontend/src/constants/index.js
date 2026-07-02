export const APP_NAME = 'LUXE BREW';
export const APP_TAGLINE = 'Premium Coffee & Tea';

export const ORDER_STATUS_COLORS = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMED: 'bg-blue-500/20 text-blue-400',
  PROCESSING: 'bg-purple-500/20 text-purple-400',
  SHIPPED: 'bg-cyan-500/20 text-cyan-400',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

export const PAYMENT_STATUS_COLORS = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  PAID: 'bg-green-500/20 text-green-400',
  FAILED: 'bg-red-500/20 text-red-400',
  REFUNDED: 'bg-blue-500/20 text-blue-400',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'featured', label: 'Featured' },
];

export const ITEMS_PER_PAGE = 12;
