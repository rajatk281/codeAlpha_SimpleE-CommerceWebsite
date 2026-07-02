const prisma = require('../lib/prisma');

class OrderRepository {
  async create(data) {
    return prisma.order.create({
      data: {
        ...data,
        items: {
          create: data.items,
        },
        payment: {
          create: data.payment,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, slug: true },
            },
          },
        },
        payment: true,
      },
    });
  }

  async findByUserId({ userId, skip, limit }) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          payment: {
            select: { status: true, method: true },
          },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, total };
  }

  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, slug: true },
            },
          },
        },
        payment: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findByOrderNumber(orderNumber) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payment: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll({ skip, limit, where, orderBy }) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          items: true,
          payment: {
            select: { status: true, method: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async updateStatus(id, status) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
        payment: true,
      },
    });
  }

  async count(where = {}) {
    return prisma.order.count({ where });
  }

  async getRevenueStats() {
    const result = await prisma.order.aggregate({
      where: {
        payment: { status: 'PAID' },
      },
      _sum: { total: true },
      _count: true,
    });
    return {
      totalRevenue: result._sum.total || 0,
      totalOrders: result._count || 0,
    };
  }

  async getRecentOrders(limit = 5) {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        payment: { select: { status: true } },
      },
    });
  }

  async getMonthlySales() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        payment: { status: 'PAID' },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    const monthlySales = {};
    orders.forEach((order) => {
      const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlySales[key]) {
        monthlySales[key] = { month: key, revenue: 0, orders: 0 };
      }
      monthlySales[key].revenue += Number(order.total);
      monthlySales[key].orders += 1;
    });

    return Object.values(monthlySales).sort((a, b) => a.month.localeCompare(b.month));
  }
}

module.exports = new OrderRepository();
