import multer from "multer";
import { resolve } from "path";
import { existsSync, mkdirSync } from "fs";

const uploadsDir = resolve("uploads");
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, _file, cb) => cb(null, "resume.pdf"),
});

export const uploadResume = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("resume");
