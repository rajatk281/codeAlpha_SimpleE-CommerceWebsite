const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');
const env = require('../config/env');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);

  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiResponse.created(res, 'Registration successful', { user, token });
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiResponse.success(res, 'Login successful', { user, token });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  ApiResponse.success(res, 'Logged out successfully');
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.success(res, 'User fetched successfully', { user });
});

module.exports = { register, login, logout, getMe };
