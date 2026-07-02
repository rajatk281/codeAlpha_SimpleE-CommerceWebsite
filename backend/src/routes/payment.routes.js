const { Router } = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/payment.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createPaymentOrderSchema, verifyPaymentSchema } = require('../validators/payment.validator');

const router = Router();

router.use(authenticate);

router.post('/create-order', validate(createPaymentOrderSchema), createPaymentOrder);
router.post('/verify', validate(verifyPaymentSchema), verifyPayment);

module.exports = router;
