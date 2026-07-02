const { ROLES } = require('../constants');
const ApiError = require('../utils/ApiError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden('You do not have permission to perform this action.');
    }

    next();
  };
};

const isAdmin = authorize(ROLES.ADMIN);

module.exports = { authorize, isAdmin };
