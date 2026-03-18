import { sentLogRepository } from "../repositories/sentLogRepository.js";

function normalizeMessageId(raw) {
  if (!raw) return null;
  const id = raw.trim();
  if (id.startsWith("<") && id.endsWith(">")) return id;
  if (id.includes("@")) return `<${id}>`;
  return id;
}

export const webhookController = {
  async brevo(req, res) {
    const event = req.body;
    const rawId = event["message-id"] || event.messageId;
    const eventType = event.event;
    const fullId = normalizeMessageId(rawId);

    console.log(`[Webhook/Brevo] ${eventType} for ${event.email} | messageId=${fullId}`);

    if (!fullId) return res.sendStatus(200);

    try {
      const log = await sentLogRepository.findByMessageId(fullId);
      if (!log) {
        console.warn(`[Webhook/Brevo] No DB record found for messageId=${fullId}`);
        return res.sendStatus(200);
      }

      console.log(`[Webhook/Brevo] Matched DB log id=${log.id}, updating ${eventType}...`);

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
        default:
          console.log(`[Webhook/Brevo] Ignoring event: ${eventType}`);
      }
    } catch (err) {
      console.error(`[Webhook/Brevo] Error: ${err.message}`);
    }

    res.sendStatus(200);
  },

  async resend(req, res) {
    const { type, data } = req.body;

    const rawIdCandidates = [
      data?.email_id,
      data?.id,
      data?.message_id,
      data?.messageId,
    ].filter(Boolean);
    const rawId = rawIdCandidates[0] || null;
    const emailId = normalizeMessageId(rawId);

    console.log(`[Webhook/Resend] ${type} for emailId=${emailId}`);

    if (!emailId) return res.sendStatus(200);

    try {
      const log = await sentLogRepository.findByMessageId(emailId);
      if (!log) {
        console.warn(`[Webhook/Resend] No DB record found for email_id=${emailId}`);
        return res.sendStatus(200);
      }

      console.log(`[Webhook/Resend] Matched DB log id=${log.id}, updating ${type}...`);

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
