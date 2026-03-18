import { authService } from "../services/authService.js";
import { success, created } from "../utils/response.js";

export const authController = {
  async register(req, res) {
    const { user, token } = await authService.register(req.body);
    return created(res, { token, user }, "Account created successfully");
  },

  async login(req, res) {
    const { user, token } = await authService.login(req.body);
    return success(res, { token, user }, "Login successful");
  },

  async me(req, res) {
    return success(res, { user: req.user }, "Authenticated user");
  },
};
