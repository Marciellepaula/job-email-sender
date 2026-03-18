import { User } from "../models/index.js";

export const userRepository = {
  async findAll() {
    return User.findAll({ order: [["id", "ASC"]] });
  },

  async findById(id) {
    return User.findByPk(id);
  },

  async findByEmail(email) {
    return User.findOne({ where: { email } });
  },

  async findByEmailWithPassword(email) {
    return User.findOne({
      where: { email },
      attributes: { include: ["password"] },
    });
  },

  async create(data) {
    return User.create(data);
  },

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(data);
  },

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
  },

  async count() {
    return User.count();
  },
};
