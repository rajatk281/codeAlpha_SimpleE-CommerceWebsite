const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const productService = require('../services/product.service');
const categoryService = require('../services/category.service');
const orderService = require('../services/order.service');
const userRepository = require('../repositories/user.repository');
const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const { buildPaginationParams, buildPaginationMeta } = require('../helpers/pagination');

const getDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, revenueStats, recentOrders, monthlySales, lowStockProducts] = await Promise.all([
    userRepository.count(),
    productRepository.count({ isActive: true }),
    orderRepository.getRevenueStats(),
    orderRepository.getRecentOrders(5),
    orderRepository.getMonthlySales(),
    productRepository.getLowStockProducts(5),
  ]);

  ApiResponse.success(res, 'Dashboard data fetched', {
    stats: {
      totalUsers,
      totalProducts,
      totalRevenue: revenueStats.totalRevenue,
      totalOrders: revenueStats.totalOrders,
    },
    recentOrders,
    monthlySales,
    lowStockProducts,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPaginationParams(req.query);
  const { search } = req.query;
  const { users, total } = await userRepository.findAll({ skip, limit, search });
  const pagination = buildPaginationMeta(page, limit, total);
  ApiResponse.paginated(res, 'Users fetched successfully', users, pagination);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userRepository.updateRole(req.params.id, req.body.role);
  ApiResponse.success(res, 'User role updated', user);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPaginationParams(req.query);
  const { status } = req.query;
  const { orders, total } = await orderService.getAllOrders({ skip, limit, status });
  const pagination = buildPaginationMeta(page, limit, total);
  ApiResponse.paginated(res, 'Orders fetched successfully', orders, pagination);
});

const getOrderDetail = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, null, true);
  ApiResponse.success(res, 'Order fetched successfully', order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  ApiResponse.success(res, 'Order status updated', order);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  ApiResponse.created(res, 'Product created successfully', product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  ApiResponse.success(res, 'Product updated successfully', product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  ApiResponse.success(res, 'Product deleted successfully');
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  ApiResponse.created(res, 'Category created successfully', category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  ApiResponse.success(res, 'Category updated successfully', category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  ApiResponse.success(res, 'Category deleted successfully');
});

const downloadInvoice = asyncHandler(async (req, res) => {
  const pdfBuffer = await orderService.generateInvoice(req.params.id, null, true);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=invoice-${req.params.id}.pdf`,
    'Content-Length': pdfBuffer.length,
  });

  res.send(pdfBuffer);
});

module.exports = {
  getDashboard,
  getAllUsers,
  updateUserRole,
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  downloadInvoice,
};
