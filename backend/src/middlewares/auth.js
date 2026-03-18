import { authService } from "../services/authService.js";
import { AppError } from "../utils/AppError.js";

export function authMiddleware(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Authentication token is required", 401);
  }

  try {
    req.user = authService.verifyToken(header.slice(7));
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}
