import { AppError } from "../utils/AppError.js";

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const messages = err.errors?.map((e) => e.message).join(", ") || err.message;
    return res.status(400).json({
      success: false,
      message: messages,
    });
  }

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  console.error("[Unhandled Error]", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
