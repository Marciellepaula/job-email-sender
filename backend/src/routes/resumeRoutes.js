import { Router } from "express";
import { resumeController } from "../controllers/resumeController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadResume } from "../middlewares/upload.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /resume/upload:
 *   post:
 *     tags: [Resume]
 *     summary: Upload a PDF resume
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded
 *       400:
 *         description: No file or invalid format
 */
router.post("/upload", uploadResume, resumeController.upload);

/**
 * @swagger
 * /resume/status:
 *   get:
 *     tags: [Resume]
 *     summary: Check if a resume has been uploaded
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resume status
 */
router.get("/status", resumeController.status);

export default router;
