import { emailService } from "../services/emailService.js";
import { success } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

export const resumeController = {
  async upload(req, res) {
    if (!req.file) throw new AppError("No file uploaded", 400);
    return success(res, { filename: req.file.filename }, "Resume uploaded successfully");
  },

  async status(_req, res) {
    return success(res, { uploaded: emailService.resumeExists() }, "Resume status retrieved");
  },
};
