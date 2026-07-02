const { Router } = require('express');
const { getCategories, getCategoryBySlug } = require('../controllers/category.controller');

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

module.exports = router;
