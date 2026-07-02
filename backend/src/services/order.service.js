const prisma = require('../lib/prisma');
const orderRepository = require('../repositories/order.repository');
const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');
const generateOrderNumber = require('../utils/generateOrderNumber');
const PDFDocument = require('pdfkit');

class OrderService {
  async createOrder(userId, { shippingDetails, razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentAmount, couponCode }) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Your cart is empty.');
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw ApiError.badRequest(`"${item.product.name}" has only ${item.product.stock} units in stock.`);
      }
      if (!item.product.isActive) {
        throw ApiError.badRequest(`"${item.product.name}" is currently unavailable.`);
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const discount = 0;
    const total = subtotal - discount;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          userId,
          orderNumber: generateOrderNumber(),
          subtotal,
          discount,
          total,
          status: 'CONFIRMED',
          shippingName: shippingDetails.name,
          shippingEmail: shippingDetails.email,
          shippingPhone: shippingDetails.phone,
          shippingAddress: shippingDetails.address,
          shippingCity: shippingDetails.city,
          shippingState: shippingDetails.state,
          shippingPincode: shippingDetails.pincode,
          couponCode: couponCode || null,
          items: {
            create: cart.items.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              productPrice: Number(item.product.price),
              productImage: item.product.image,
              quantity: item.quantity,
              total: Number(item.product.price) * item.quantity,
            })),
          },
          payment: {
            create: {
              razorpayOrderId,
              razorpayPaymentId,
              razorpaySignature,
              amount: total,
              currency: 'INR',
              status: 'PAID',
            },
          },
        },
        include: {
          items: true,
          payment: true,
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });

    return order;
  }

  async getUserOrders(userId, { skip, limit }) {
    return orderRepository.findByUserId({ userId, skip, limit });
  }

  async getOrderById(orderId, userId, isAdmin = false) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found.');
    }

    if (!isAdmin && order.userId !== userId) {
      throw ApiError.forbidden('Access denied.');
    }

    return order;
  }

  async updateOrderStatus(orderId, status) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found.');
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw ApiError.badRequest(`Cannot update status. Order is already ${order.status.toLowerCase()}.`);
    }

    return orderRepository.updateStatus(orderId, status);
  }

  async getAllOrders({ skip, limit, status }) {
    const where = {};
    if (status) {
      where.status = status;
    }
    return orderRepository.findAll({ skip, limit, where });
  }

  async generateInvoice(orderId, userId, isAdmin = false) {
    const order = await this.getOrderById(orderId, userId, isAdmin);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      doc.fontSize(24).font('Helvetica-Bold').text('LUXE BREW', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor('#888888').text('Premium Coffee & Tea', { align: 'center' });
      doc.moveDown(1.5);

      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#CCCCCC').stroke();
      doc.moveDown(1);

      doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text('INVOICE');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor('#444444');
      doc.text(`Order #: ${order.orderNumber}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`);
      doc.text(`Status: ${order.status}`);
      doc.text(`Payment: ${order.payment?.status || 'N/A'}`);
      doc.moveDown(1);

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Ship To:');
      doc.fontSize(10).font('Helvetica').fillColor('#444444');
      doc.text(order.shippingName);
      doc.text(order.shippingAddress);
      doc.text(`${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}`);
      doc.text(`Phone: ${order.shippingPhone}`);
      doc.text(`Email: ${order.shippingEmail}`);
      doc.moveDown(1.5);

      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#CCCCCC').stroke();
      doc.moveDown(0.5);

      const tableTop = doc.y;
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000');
      doc.text('Item', 50, tableTop, { width: 230 });
      doc.text('Qty', 290, tableTop, { width: 60, align: 'center' });
      doc.text('Price', 360, tableTop, { width: 80, align: 'right' });
      doc.text('Total', 450, tableTop, { width: 95, align: 'right' });
      doc.moveDown(0.5);

      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#EEEEEE').stroke();
      doc.moveDown(0.5);

      doc.font('Helvetica').fillColor('#444444');
      order.items.forEach((item) => {
        const y = doc.y;
        doc.text(item.productName, 50, y, { width: 230 });
        doc.text(item.quantity.toString(), 290, y, { width: 60, align: 'center' });
        doc.text(`₹${Number(item.productPrice).toFixed(2)}`, 360, y, { width: 80, align: 'right' });
        doc.text(`₹${Number(item.total).toFixed(2)}`, 450, y, { width: 95, align: 'right' });
        doc.moveDown(0.8);
      });

      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#CCCCCC').stroke();
      doc.moveDown(1);

      const rightX = 360;
      doc.fontSize(10).font('Helvetica').fillColor('#444444');
      doc.text('Subtotal:', rightX, doc.y, { width: 80, align: 'right', continued: true });
      doc.text(`  ₹${Number(order.subtotal).toFixed(2)}`, { width: 95, align: 'right' });

      if (Number(order.discount) > 0) {
        doc.text('Discount:', rightX, doc.y, { width: 80, align: 'right', continued: true });
        doc.text(`  -₹${Number(order.discount).toFixed(2)}`, { width: 95, align: 'right' });
      }

      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000');
      doc.text('Total:', rightX, doc.y, { width: 80, align: 'right', continued: true });
      doc.text(`  ₹${Number(order.total).toFixed(2)}`, { width: 95, align: 'right' });

      doc.moveDown(3);
      doc.fontSize(8).font('Helvetica').fillColor('#AAAAAA').text(
        'Thank you for shopping with LUXE BREW. This is a computer-generated invoice.',
        { align: 'center' }
      );

      doc.end();
    });
  }
}

module.exports = new OrderService();
