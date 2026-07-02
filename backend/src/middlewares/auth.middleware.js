const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required. Please login.');
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);

  req.user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };
  
  next();
});

module.exports = authenticate;
