const { Router } = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');
const validate = require('../middlewares/validate.middleware');
const adminController = require('../controllers/admin.controller');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');
const { updateOrderStatusSchema } = require('../validators/order.validator');
const { categorySchema, updateCategorySchema } = require('../validators/common.validator');

const router = Router();

router.use(authenticate, isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Users
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/role', adminController.updateUserRole);

// Orders
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderDetail);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), adminController.updateOrderStatus);
router.get('/orders/:id/invoice', adminController.downloadInvoice);

// Products
router.post('/products', validate(createProductSchema), adminController.createProduct);
router.patch('/products/:id', validate(updateProductSchema), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Categories
router.post('/categories', validate(categorySchema), adminController.createCategory);
router.patch('/categories/:id', validate(updateCategorySchema), adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

module.exports = router;
