const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    return user;
  }

  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    return userRepository.update(userId, data);
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await userRepository.findById(userId, true);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw ApiError.badRequest('Current password is incorrect.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userRepository.update(userId, { password: hashedPassword });

    return { message: 'Password changed successfully.' };
  }
}

module.exports = new UserService();
