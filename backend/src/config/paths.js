import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

/** Diretório raiz do backend (pasta que contém `package.json`, `uploads/`, etc.) */
// Este arquivo: backend/src/config/paths.js → sobe 2 níveis até backend/
const pathsFile = fileURLToPath(import.meta.url);
export const BACKEND_ROOT = resolve(pathsFile, "..", "..", "..");

/** Mesmo caminho usado pelo multer e pelo emailService — evita “upload ok” mas currículo não encontrado */
export const UPLOADS_DIR = resolve(BACKEND_ROOT, "uploads");
export const RESUME_PDF_PATH = resolve(UPLOADS_DIR, "resume.pdf");

export function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}
