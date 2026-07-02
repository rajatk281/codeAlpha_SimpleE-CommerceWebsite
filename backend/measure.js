const axios = require('axios');
const { performance } = require('perf_hooks');
const prisma = require('./src/lib/prisma');

async function measure() {
  console.log('--- STARTING PERFORMANCE MEASUREMENT ---');
  
  // 1. Get a user and product
  const user = await prisma.user.findFirst({ where: { email: 'user@luxebrew.com' } });
  const product = await prisma.product.findFirst();

  if (!user || !product) {
    console.log('Missing user or product for testing');
    return;
  }

  // 2. Login to get token
  let token;
  try {
    const res = await axios.post('https://codealpha-simplee-commercewebsite.onrender.com/api/auth/login', {
      email: 'user@luxebrew.com',
      password: 'user123'
    });
    token = res.data.data.token;
  } catch (err) {
    console.error('Login failed:', err.message);
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  // 3. Measure Add to Cart
  console.log('\nMeasuring POST /api/cart/items ...');
  const startCart = performance.now();
  try {
    await axios.post('https://codealpha-simplee-commercewebsite.onrender.com/api/cart/items', {
      productId: product.id,
      quantity: 1
    }, { headers });
  } catch(e) {}
  const endCart = performance.now();
  console.log(`Add to Cart Total API Time: ${(endCart - startCart).toFixed(2)}ms`);

  // 4. Measure Add to Wishlist
  console.log('\nMeasuring POST /api/wishlist ...');
  const startWishlist = performance.now();
  try {
    await axios.post('https://codealpha-simplee-commercewebsite.onrender.com/api/wishlist', {
      productId: product.id
    }, { headers });
  } catch(e) {}
  const endWishlist = performance.now();
  console.log(`Add to Wishlist Total API Time: ${(endWishlist - startWishlist).toFixed(2)}ms`);
  
  console.log('\n--- MEASUREMENT COMPLETE ---');
  process.exit(0);
}

measure();
