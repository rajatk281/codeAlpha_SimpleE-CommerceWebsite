const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const userService = require('../services/user.service');

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  ApiResponse.success(res, 'Profile fetched successfully', user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  ApiResponse.success(res, 'Profile updated successfully', user);
});

const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  ApiResponse.success(res, 'Password changed successfully');
});

module.exports = { getProfile, updateProfile, changePassword };
