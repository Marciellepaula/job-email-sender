import { Router } from "express";
import { webhookController } from "../controllers/webhookController.js";

const router = Router();

/**
 * @swagger
 * /webhooks/brevo:
 *   post:
 *     tags: [Webhooks]
 *     summary: Receive Brevo email tracking events
 *     description: Endpoint for Brevo to send delivery, open, click, and bounce events
 *     responses:
 *       200:
 *         description: Event received
 */
router.post("/brevo", webhookController.brevo);

/**
 * @swagger
 * /webhooks/resend:
 *   post:
 *     tags: [Webhooks]
 *     summary: Receive Resend email tracking events
 *     description: Endpoint for Resend to send delivery, open, click, and bounce events
 *     responses:
 *       200:
 *         description: Event received
 */
router.post("/resend", webhookController.resend);

export default router;
