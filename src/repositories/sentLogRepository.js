import { SentLog } from "../models/index.js";
import sequelize from "../config/database.js";

export const sentLogRepository = {
  async findAll() {
    return SentLog.findAll({ order: [["created_at", "DESC"]] });
  },

  async create(data) {
    return SentLog.create(data);
  },

  async findSentByEmail(email) {
    return SentLog.findOne({ where: { email, status: "sent" } });
  },

  async findByMessageId(messageId) {
    return SentLog.findOne({ where: { messageId } });
  },

  async findByEmail(email) {
    return SentLog.findAll({ where: { email }, order: [["created_at", "DESC"]] });
  },

  async updateTracking(id, data) {
    return SentLog.update(data, { where: { id } });
  },

  async markOpened(messageId) {
    const log = await this.findByMessageId(messageId);
    if (!log) return null;
    await SentLog.update(
      {
        openedAt: log.openedAt || new Date(),
        openCount: sequelize.literal("open_count + 1"),
      },
      { where: { id: log.id } }
    );
    return log;
  },

  async markDelivered(messageId) {
    const log = await this.findByMessageId(messageId);
    if (!log) return null;
    if (!log.deliveredAt) {
      await SentLog.update({ deliveredAt: new Date() }, { where: { id: log.id } });
    }
    return log;
  },

  async markBounced(messageId) {
    const log = await this.findByMessageId(messageId);
    if (!log) return null;
    await SentLog.update({ bouncedAt: new Date() }, { where: { id: log.id } });
    return log;
  },

  async markClicked(messageId) {
    const log = await this.findByMessageId(messageId);
    if (!log) return null;
    if (!log.clickedAt) {
      await SentLog.update({ clickedAt: new Date() }, { where: { id: log.id } });
    }
    return log;
  },

  async deleteAll() {
    return SentLog.destroy({ where: {} });
  },
};
