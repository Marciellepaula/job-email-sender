import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { userRepository } from "../repositories/userRepository.js";
import { AppError } from "../utils/AppError.js";

export const authService = {
  async register({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Email already registered", 409);
    }
    const user = await userRepository.create({ name, email, password });
    const token = this.signToken(user);
    return { user, token };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.validPassword(password))) {
      throw new AppError("Invalid credentials", 401);
    }
    const token = this.signToken(user);
    return { user, token };
  },

  signToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  },

  verifyToken(token) {
    return jwt.verify(token, config.jwt.secret);
  },
};
