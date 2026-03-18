import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import contactRoutes from "./contactRoutes.js";
import emailRoutes from "./emailRoutes.js";
import resumeRoutes from "./resumeRoutes.js";
import healthRoutes from "./healthRoutes.js";
import webhookRoutes from "./webhookRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/contacts", contactRoutes);
router.use("/emails", emailRoutes);
router.use("/resume", resumeRoutes);
router.use("/health", healthRoutes);
router.use("/webhooks", webhookRoutes);

export default router;
