const { Router } = require('express');
const { getProducts, getProductBySlug, getFeaturedProducts, getRelatedProducts } = require('../controllers/product.controller');
const validate = require('../middlewares/validate.middleware');
const { productQuerySchema } = require('../validators/product.validator');

const router = Router();

router.get('/', validate(productQuerySchema, 'query'), getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProductBySlug);
router.get('/:slug/related', getRelatedProducts);

module.exports = router;
