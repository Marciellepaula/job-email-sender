import { AppError } from "../utils/AppError.js";

export function validate(schema, property = "body") {
  return (req, _res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      throw new AppError(messages, 400);
    }
    next();
  };
}
