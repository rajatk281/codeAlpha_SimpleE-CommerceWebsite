const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@luxebrew.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '9876543210',
      address: '123 Admin Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
  });
  console.log('👤 Admin user created:', admin.email);

  // Create Test User
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.create({
    data: {
      name: 'Rajat Sharma',
      email: 'user@luxebrew.com',
      password: userPassword,
      role: 'USER',
      phone: '9876543211',
      address: '456 User Lane',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
  });
  console.log('👤 Test user created:', user.email);

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Coffee & Espresso',
        slug: 'coffee-espresso',
        description: 'Premium single-origin coffees and expertly crafted espresso blends from the world\'s finest estates.',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Tea Collection',
        slug: 'tea-collection',
        description: 'Exquisite teas sourced from legendary gardens — from delicate white teas to robust black blends.',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Brewing Equipment',
        slug: 'brewing-equipment',
        description: 'Professional-grade brewing tools to elevate your daily ritual.',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mugs & Cups',
        slug: 'mugs-cups',
        description: 'Handcrafted ceramics and artisan drinkware designed for the perfect sip.',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Gift Sets',
        slug: 'gift-sets',
        description: 'Curated gift collections for the coffee and tea connoisseur in your life.',
        image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Essential accessories to complete your brewing setup.',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800',
      },
    }),
  ]);

  console.log(`☕ ${categories.length} categories created`);

  const [coffee, tea, equipment, mugs, gifts, accessories] = categories;

  // Create Products
  const products = await Promise.all([
    // Coffee & Espresso (5)
    prisma.product.create({
      data: {
        name: 'Ethiopian Yirgacheffe Single Origin',
        slug: 'ethiopian-yirgacheffe-single-origin',
        description: 'A bright and complex coffee with notes of blueberry, dark chocolate, and a wine-like finish. Sourced from smallholder farmers in the Yirgacheffe region at 1,900-2,200 meters elevation. Light to medium roast to preserve its delicate floral aromatics.',
        price: 1299.00,
        compareAtPrice: 1599.00,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
        images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800'],
        categoryId: coffee.id,
        stock: 45,
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Colombian Supremo Dark Roast',
        slug: 'colombian-supremo-dark-roast',
        description: 'Rich, full-bodied Colombian Supremo with caramel sweetness and a smooth, nutty finish. Grown in the high-altitude Huila region, this dark roast delivers bold flavor with low acidity. Perfect for espresso or French press.',
        price: 999.00,
        compareAtPrice: 1299.00,
        image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800',
        images: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800'],
        categoryId: coffee.id,
        stock: 60,
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sumatra Mandheling Reserve',
        slug: 'sumatra-mandheling-reserve',
        description: 'An earthy, herbal Indonesian coffee with deep cedar notes and a syrupy body. Wet-hulled processed in the Mandheling highlands. This reserve lot delivers intense, complex flavors ideal for those who love full-bodied dark coffees.',
        price: 1499.00,
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800',
        images: [],
        categoryId: coffee.id,
        stock: 30,
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Italian Espresso Blend',
        slug: 'italian-espresso-blend',
        description: 'A classic Italian-style espresso blend combining Brazilian, Vietnamese, and Indian beans. Dark roasted for a rich crema, intense chocolate flavors, and a lingering smoky finish. The ultimate espresso experience.',
        price: 849.00,
        image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800',
        images: [],
        categoryId: coffee.id,
        stock: 80,
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Jamaica Blue Mountain Premium',
        slug: 'jamaica-blue-mountain-premium',
        description: 'One of the world\'s most sought-after coffees. Grown at 2,000+ meters in Jamaica\'s Blue Mountains, this coffee offers mild flavor, bright acidity, and a remarkably clean, sweet taste with no bitterness.',
        price: 3499.00,
        compareAtPrice: 3999.00,
        image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800',
        images: [],
        categoryId: coffee.id,
        stock: 15,
        featured: true,
      },
    }),

    // Tea Collection (5)
    prisma.product.create({
      data: {
        name: 'Darjeeling First Flush FTGFOP1',
        slug: 'darjeeling-first-flush-ftgfop1',
        description: 'The champagne of teas — delicate, muscatel, and floral. Harvested during the first spring flush from a heritage estate in Darjeeling. Light amber liquor with notes of apricot and a brisk, clean finish.',
        price: 1899.00,
        compareAtPrice: 2199.00,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
        images: [],
        categoryId: tea.id,
        stock: 35,
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Japanese Ceremonial Matcha',
        slug: 'japanese-ceremonial-matcha',
        description: 'Stone-ground ceremonial grade matcha from Uji, Kyoto. Vibrant green color, smooth umami flavor, and creamy texture. Shade-grown for 21 days to maximize L-theanine and chlorophyll content.',
        price: 2499.00,
        image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800',
        images: [],
        categoryId: tea.id,
        stock: 25,
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Assam Golden Tips TGFOP',
        slug: 'assam-golden-tips-tgfop',
        description: 'Bold, malty Assam black tea with distinctive golden tips. Full-bodied with a rich, brisk character and deep amber color. Perfect with or without milk. Sourced from the Mangalam estate.',
        price: 799.00,
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6201f?w=800',
        images: [],
        categoryId: tea.id,
        stock: 55,
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Oolong Tie Guan Yin Supreme',
        slug: 'oolong-tie-guan-yin-supreme',
        description: 'Award-winning Tie Guan Yin (Iron Goddess) oolong from Anxi, Fujian. Floral orchid aroma, buttery texture, and a sweet, lingering aftertaste. Hand-rolled leaves that unfurl beautifully during brewing.',
        price: 1699.00,
        image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800',
        images: [],
        categoryId: tea.id,
        stock: 20,
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'White Silver Needle Bai Hao',
        slug: 'white-silver-needle-bai-hao',
        description: 'The most prized white tea, composed entirely of unopened buds covered in fine white down. Subtle sweetness with notes of honeydew and cucumber. Minimally processed to preserve delicate antioxidants.',
        price: 2199.00,
        image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=800',
        images: [],
        categoryId: tea.id,
        stock: 18,
        featured: false,
      },
    }),

    // Brewing Equipment (4)
    prisma.product.create({
      data: {
        name: 'Hario V60 Pour Over Kit',
        slug: 'hario-v60-pour-over-kit',
        description: 'Complete pour-over set featuring the iconic Hario V60 ceramic dripper, thermal carafe, measuring spoon, and 100 paper filters. The spiral rib design enables maximum extraction for a clean, vibrant cup.',
        price: 3499.00,
        compareAtPrice: 3999.00,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
        images: [],
        categoryId: equipment.id,
        stock: 20,
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'AeroPress Original Coffee Maker',
        slug: 'aeropress-original-coffee-maker',
        description: 'The versatile AeroPress brews American, espresso-style, and cold brew coffee in just 1-2 minutes. Air pressure produces smooth, rich, grit-free coffee with low acidity. Includes 350 micro-filters.',
        price: 2999.00,
        image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=800',
        images: [],
        categoryId: equipment.id,
        stock: 35,
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Moka Pot Stainless Steel 6-Cup',
        slug: 'moka-pot-stainless-steel-6-cup',
        description: 'Classic Italian stovetop espresso maker in premium stainless steel. Brews 6 cups of rich, aromatic coffee. Compatible with all stovetops including induction. Elegant design with heat-resistant handle.',
        price: 2499.00,
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
        images: [],
        categoryId: equipment.id,
        stock: 25,
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Burr Coffee Grinder Pro',
        slug: 'burr-coffee-grinder-pro',
        description: 'Professional conical burr grinder with 40 grind settings from Turkish fine to French press coarse. Stainless steel burrs, low-noise motor, and large 340g bean hopper. Consistent grind for superior extraction.',
        price: 5999.00,
        compareAtPrice: 6999.00,
        image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800',
        images: [],
        categoryId: equipment.id,
        stock: 12,
        featured: true,
      },
    }),

    // Mugs & Cups (3)
    prisma.product.create({
      data: {
        name: 'Artisan Ceramic Mug — Midnight',
        slug: 'artisan-ceramic-mug-midnight',
        description: 'Handcrafted ceramic mug with a matte black exterior and glossy copper interior glaze. 350ml capacity, ergonomic handle, and a weighted base for stability. Microwave and dishwasher safe.',
        price: 899.00,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
        images: [],
        categoryId: mugs.id,
        stock: 50,
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Double Wall Glass Cup Set (4)',
        slug: 'double-wall-glass-cup-set',
        description: 'Set of 4 borosilicate double-wall glass cups. 250ml each. The insulated design keeps drinks hot while remaining cool to touch. Perfect for espresso, tea, and latte art. Heat-resistant to 150°C.',
        price: 1499.00,
        compareAtPrice: 1799.00,
        image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800',
        images: [],
        categoryId: mugs.id,
        stock: 40,
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Travel Thermos — Brushed Gold',
        slug: 'travel-thermos-brushed-gold',
        description: 'Premium 500ml vacuum-insulated travel thermos in brushed gold finish. Keeps beverages hot for 12 hours or cold for 24. Leak-proof lid, one-hand operation, and fits standard car cup holders.',
        price: 1999.00,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        images: [],
        categoryId: mugs.id,
        stock: 30,
        featured: false,
      },
    }),

    // Gift Sets (2)
    prisma.product.create({
      data: {
        name: 'The Connoisseur\'s Collection',
        slug: 'the-connoisseurs-collection',
        description: 'An exquisite gift box featuring 5 single-origin coffees (50g each), an artisan ceramic mug, a bamboo scoop, and a tasting notes booklet. Presented in a luxury kraft box with magnetic closure.',
        price: 4999.00,
        compareAtPrice: 5999.00,
        image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=800',
        images: ['https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=800'],
        categoryId: gifts.id,
        stock: 15,
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tea Ceremony Starter Kit',
        slug: 'tea-ceremony-starter-kit',
        description: 'Everything needed for an authentic tea experience: ceremonial matcha (30g), bamboo whisk (chasen), bamboo scoop (chashaku), ceramic matcha bowl (chawan), and an illustrated guide.',
        price: 3999.00,
        image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=800',
        images: [],
        categoryId: gifts.id,
        stock: 20,
        featured: false,
      },
    }),

    // Accessories (3)
    prisma.product.create({
      data: {
        name: 'Precision Coffee Scale',
        slug: 'precision-coffee-scale',
        description: 'Digital pour-over scale with built-in timer, 0.1g precision, and auto-off. Weighs up to 3kg. Sleek black silicone pad protects the surface. USB-C rechargeable with 20-hour battery life.',
        price: 2499.00,
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
        images: [],
        categoryId: accessories.id,
        stock: 22,
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Gooseneck Electric Kettle',
        slug: 'gooseneck-electric-kettle',
        description: 'Temperature-controlled gooseneck kettle with ±1°C precision. 1L capacity, 5 preset temperatures, hold function, and a sleek matte black body. Essential for pour-over and specialty tea brewing.',
        price: 3999.00,
        compareAtPrice: 4499.00,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
        images: [],
        categoryId: accessories.id,
        stock: 18,
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Reusable Coffee Filter — Stainless Steel',
        slug: 'reusable-coffee-filter-stainless-steel',
        description: 'Eco-friendly permanent coffee filter made from food-grade stainless steel mesh. Fits most pour-over drippers and standard coffee makers. Produces a full-bodied cup while being zero-waste.',
        price: 599.00,
        image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=800',
        images: [],
        categoryId: accessories.id,
        stock: 65,
        featured: false,
      },
    }),
  ]);

  console.log(`📦 ${products.length} products created`);
  console.log('\n✅ Database seeded successfully!');
  console.log('\n📋 Seed Accounts:');
  console.log('   Admin: admin@luxebrew.com / admin123');
  console.log('   User:  user@luxebrew.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
