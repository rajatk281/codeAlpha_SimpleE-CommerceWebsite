const { Router } = require('express');
const { createOrder, getUserOrders, getOrderById, downloadInvoice } = require('../controllers/order.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createOrderSchema } = require('../validators/order.validator');

const router = Router();

router.use(authenticate);

router.post('/', validate(createOrderSchema), createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.get('/:id/invoice', downloadInvoice);

module.exports = router;
