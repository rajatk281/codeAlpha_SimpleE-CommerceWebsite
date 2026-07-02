const { performance } = require('perf_hooks');
const prisma = require('./src/lib/prisma');

async function measurePrisma() {
  console.log('--- MEASURING PRISMA LATENCY ---');
  
  const startUser = performance.now();
  const user = await prisma.user.findFirst({ where: { email: 'user@luxebrew.com' } });
  console.log(`User query took ${(performance.now() - startUser).toFixed(2)}ms`);

  const startProduct = performance.now();
  const product = await prisma.product.findFirst();
  console.log(`Product query took ${(performance.now() - startProduct).toFixed(2)}ms`);

  const startCartLean = performance.now();
  const cartLean = await prisma.cart.findUnique({
    where: { userId: user.id },
    select: { id: true, items: { where: { productId: product.id }, select: { quantity: true } } }
  });
  console.log(`Lean Cart query took ${(performance.now() - startCartLean).toFixed(2)}ms`);

  const startCartFull = performance.now();
  const cartFull = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: { include: { category: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  console.log(`Full Cart query took ${(performance.now() - startCartFull).toFixed(2)}ms`);

  const startWishlistAdd = performance.now();
  try {
    await prisma.wishlistItem.create({
      data: { userId: user.id, productId: product.id },
    });
  } catch(e) { console.log('Wishlist create threw', e.code); }
  console.log(`Wishlist create took ${(performance.now() - startWishlistAdd).toFixed(2)}ms`);

  process.exit(0);
}

measurePrisma();
