import { contactService } from "../services/contactService.js";
import { success, created } from "../utils/response.js";

export const contactController = {
  async findAll(_req, res) {
    const contacts = await contactService.findAll();
    return success(res, contacts, "Contacts retrieved successfully");
  },

  async findById(req, res) {
    const contact = await contactService.findById(Number(req.params.id));
    return success(res, contact, "Contact retrieved successfully");
  },

  async create(req, res) {
    const contact = await contactService.create(req.body);
    return created(res, contact, "Contact created successfully");
  },

  async update(req, res) {
    const contact = await contactService.update(Number(req.params.id), req.body);
    return success(res, contact, "Contact updated successfully");
  },

  async delete(req, res) {
    await contactService.delete(Number(req.params.id));
    return success(res, null, "Contact deleted successfully");
  },
};
