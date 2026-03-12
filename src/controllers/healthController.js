import { mailerService } from "../services/mailerService.js";
import { emailService } from "../services/emailService.js";
import { contactService } from "../services/contactService.js";
import { success } from "../utils/response.js";

export const healthController = {
  async check(_req, res) {
    const email = await mailerService.verify();
    const contactsCount = await contactService.count();

    return success(res, {
      status: "ok",
      email,
      resumeUploaded: emailService.resumeExists(),
      contactsCount,
      sendingInProgress: emailService.isSending(),
    }, "Health check passed");
  },
};
