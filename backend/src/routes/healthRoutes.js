import { Router } from "express";
import { healthController } from "../controllers/healthController.js";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Application health check
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/", healthController.check);

export default router;
