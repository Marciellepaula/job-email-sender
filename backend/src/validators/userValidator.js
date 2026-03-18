import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().min(6).max(128).messages({
    "string.min": "Password must be at least 6 characters",
  }),
}).min(1).messages({
  "object.min": "At least one field must be provided",
});
