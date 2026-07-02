const { Router } = require('express');
const { getCart, addItem, updateItemQuantity, removeItem, clearCart } = require('../controllers/cart.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { addToCartSchema, updateCartItemSchema } = require('../validators/cart.validator');

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/items', validate(addToCartSchema), addItem);
router.patch('/items/:id', validate(updateCartItemSchema), updateItemQuantity);
router.delete('/items/:id', removeItem);
router.delete('/', clearCart);

module.exports = router;
