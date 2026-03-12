import { userService } from "../services/userService.js";
import { success, created } from "../utils/response.js";

export const userController = {
  async findAll(_req, res) {
    const users = await userService.findAll();
    return success(res, users, "Users retrieved successfully");
  },

  async findById(req, res) {
    const user = await userService.findById(Number(req.params.id));
    return success(res, user, "User retrieved successfully");
  },

  async create(req, res) {
    const user = await userService.create(req.body);
    return created(res, user, "User created successfully");
  },

  async update(req, res) {
    const user = await userService.update(Number(req.params.id), req.body);
    return success(res, user, "User updated successfully");
  },

  async delete(req, res) {
    await userService.delete(Number(req.params.id));
    return success(res, null, "User deleted successfully");
  },
};
