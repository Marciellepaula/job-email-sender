import { Router } from "express";
import { emailController } from "../controllers/emailController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /emails/send:
 *   post:
 *     tags: [Emails]
 *     summary: Start sending emails to all contacts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sending started
 *       409:
 *         description: Already sending
 */
router.post("/send", emailController.send);

/**
 * @swagger
 * /emails/status:
 *   get:
 *     tags: [Emails]
 *     summary: Get current sending status and results
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sending status
 */
router.get("/status", emailController.status);

/**
 * @swagger
 * /emails/logs:
 *   get:
 *     tags: [Emails]
 *     summary: Get all sent email logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email logs
 *   delete:
 *     tags: [Emails]
 *     summary: Clear all email logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs cleared
 */
router.get("/logs", emailController.getLogs);
router.delete("/logs", emailController.clearLogs);

export default router;
