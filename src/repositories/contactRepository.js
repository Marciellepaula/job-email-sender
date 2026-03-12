import { Contact } from "../models/index.js";

export const contactRepository = {
  async findAll() {
    return Contact.findAll({ order: [["id", "ASC"]] });
  },

  async findById(id) {
    return Contact.findByPk(id);
  },

  async findByEmail(email) {
    return Contact.findOne({ where: { email } });
  },

  async create(data) {
    return Contact.create(data);
  },

  async update(id, data) {
    const contact = await Contact.findByPk(id);
    if (!contact) return null;
    return contact.update(data);
  },

  async delete(id) {
    const contact = await Contact.findByPk(id);
    if (!contact) return false;
    await contact.destroy();
    return true;
  },

  async count() {
    return Contact.count();
  },
};
