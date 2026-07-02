const prisma = require('../lib/prisma');

class PaymentRepository {
  async create(data) {
    return prisma.payment.create({ data });
  }

  async findByOrderId(orderId) {
    return prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: {
          select: { id: true, orderNumber: true, status: true },
        },
      },
    });
  }

  async findByRazorpayOrderId(razorpayOrderId) {
    return prisma.payment.findUnique({
      where: { razorpayOrderId },
      include: {
        order: {
          include: {
            items: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async updatePaymentStatus(id, data) {
    return prisma.payment.update({
      where: { id },
      data,
    });
  }

  async findById(id) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });
  }
}

module.exports = new PaymentRepository();
