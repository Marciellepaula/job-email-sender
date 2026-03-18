import { contactRepository } from "../repositories/contactRepository.js";
import { AppError } from "../utils/AppError.js";

export const contactService = {
  async findAll() {
    return contactRepository.findAll();
  },

  async findById(id) {
    const contact = await contactRepository.findById(id);
    if (!contact) throw new AppError("Contact not found", 404);
    return contact;
  },

  async create(data) {
    const existing = await contactRepository.findByEmail(data.email);
    if (existing) throw new AppError("Contact with this email already exists", 409);
    return contactRepository.create(data);
  },

  async update(id, data) {
    if (data.email) {
      const existing = await contactRepository.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new AppError("Email already in use by another contact", 409);
      }
    }
    const contact = await contactRepository.update(id, data);
    if (!contact) throw new AppError("Contact not found", 404);
    return contact;
  },

  async delete(id) {
    const deleted = await contactRepository.delete(id);
    if (!deleted) throw new AppError("Contact not found", 404);
  },

  async count() {
    return contactRepository.count();
  },
};
