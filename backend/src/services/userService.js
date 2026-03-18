import { userRepository } from "../repositories/userRepository.js";
import { AppError } from "../utils/AppError.js";

export const userService = {
  async findAll() {
    return userRepository.findAll();
  },

  async findById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  },

  async create(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new AppError("Email already in use", 409);
    return userRepository.create(data);
  },

  async update(id, data) {
    if (data.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new AppError("Email already in use", 409);
      }
    }
    const user = await userRepository.update(id, data);
    if (!user) throw new AppError("User not found", 404);
    return user;
  },

  async delete(id) {
    const deleted = await userRepository.delete(id);
    if (!deleted) throw new AppError("User not found", 404);
  },
};
