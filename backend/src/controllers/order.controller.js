const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const orderService = require('../services/order.service');
const { buildPaginationParams, buildPaginationMeta } = require('../helpers/pagination');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  ApiResponse.created(res, 'Order placed successfully', order);
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPaginationParams(req.query);
  const { orders, total } = await orderService.getUserOrders(req.user.id, { skip, limit });
  const pagination = buildPaginationMeta(page, limit, total);
  ApiResponse.paginated(res, 'Orders fetched successfully', orders, pagination);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id);
  ApiResponse.success(res, 'Order fetched successfully', order);
});

const downloadInvoice = asyncHandler(async (req, res) => {
  const pdfBuffer = await orderService.generateInvoice(req.params.id, req.user.id);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=invoice-${req.params.id}.pdf`,
    'Content-Length': pdfBuffer.length,
  });

  res.send(pdfBuffer);
});

module.exports = { createOrder, getUserOrders, getOrderById, downloadInvoice };
