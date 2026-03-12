import { emailService } from "../services/emailService.js";
import { success } from "../utils/response.js";

export const emailController = {
  async send(req, res) {
    const { subject, message, contactIds } = req.body || {};
    emailService.sendAll({ subject, message, contactIds }, (progress) => {
      console.log(`[Progress] ${progress.status}: ${progress.email}`);
    }).catch((err) => console.error("[Send Error]", err.message));

    return success(res, { sending: true }, "Sending started");
  },

  async status(_req, res) {
    return success(res, {
      inProgress: emailService.isSending(),
      results: emailService.getResults(),
    }, "Send status retrieved");
  },

  async getLogs(_req, res) {
    const logs = await emailService.getLogs();
    return success(res, logs, "Logs retrieved successfully");
  },

  async clearLogs(_req, res) {
    await emailService.clearLogs();
    return success(res, null, "Logs cleared successfully");
  },
};
