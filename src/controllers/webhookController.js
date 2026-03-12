import { sentLogRepository } from "../repositories/sentLogRepository.js";

export const webhookController = {
  async brevo(req, res) {
    const event = req.body;
    const messageId = event["message-id"] || event.messageId;
    const eventType = event.event;

    console.log(`[Webhook/Brevo] ${eventType} for ${event.email} (${messageId})`);

    if (!messageId) return res.sendStatus(200);

    const fullId = messageId.includes("@") ? `<${messageId}>` : messageId;

    try {
      switch (eventType) {
        case "delivered":
          await sentLogRepository.markDelivered(fullId);
          break;
        case "opened":
        case "unique_opened":
          await sentLogRepository.markOpened(fullId);
          break;
        case "click":
          await sentLogRepository.markClicked(fullId);
          break;
        case "hard_bounce":
        case "soft_bounce":
        case "blocked":
          await sentLogRepository.markBounced(fullId);
          break;
      }
    } catch (err) {
      console.error(`[Webhook/Brevo] Error: ${err.message}`);
    }

    res.sendStatus(200);
  },

  async resend(req, res) {
    const { type, data } = req.body;

    const emailId = data?.email_id;
    console.log(`[Webhook/Resend] ${type} for email_id=${emailId}`);

    if (!emailId) return res.sendStatus(200);

    try {
      switch (type) {
        case "email.delivered":
          await sentLogRepository.markDelivered(emailId);
          break;
        case "email.opened":
          await sentLogRepository.markOpened(emailId);
          break;
        case "email.clicked":
          await sentLogRepository.markClicked(emailId);
          break;
        case "email.bounced":
          await sentLogRepository.markBounced(emailId);
          break;
      }
    } catch (err) {
      console.error(`[Webhook/Resend] Error: ${err.message}`);
    }

    res.sendStatus(200);
  },
};
