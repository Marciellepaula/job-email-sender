import { SentLog } from "../models/index.js";

export const sentLogRepository = {
  async findAll() {
    return SentLog.findAll({ order: [["created_at", "ASC"]] });
  },

  async create(data) {
    return SentLog.create(data);
  },

  async findSentByEmail(email) {
    return SentLog.findOne({ where: { email, status: "sent" } });
  },

  async deleteAll() {
    return SentLog.destroy({ where: {} });
  },
};
