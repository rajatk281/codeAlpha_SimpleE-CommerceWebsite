const { Router } = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileSchema, changePasswordSchema } = require('../validators/user.validator');

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);
router.patch('/change-password', validate(changePasswordSchema), changePassword);

module.exports = router;
