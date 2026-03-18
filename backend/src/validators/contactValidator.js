import Joi from "joi";

export const createContactSchema = Joi.object({
  companyName: Joi.string().min(1).max(200).required().messages({
    "any.required": "Company name is required",
    "string.empty": "Company name cannot be empty",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  recruiterName: Joi.string().max(200).allow("").optional(),
});

export const updateContactSchema = Joi.object({
  companyName: Joi.string().min(1).max(200).messages({
    "string.empty": "Company name cannot be empty",
  }),
  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email",
  }),
  recruiterName: Joi.string().max(200).allow(""),
}).min(1).messages({
  "object.min": "At least one field must be provided",
});
