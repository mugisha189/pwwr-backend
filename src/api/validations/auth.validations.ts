import Joi from "joi";

export default {
  login: Joi.object({
    email: Joi.string().required().messages({
      "string.empty": "Email  is required.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
  }),
  newPassword: Joi.object({
    token: Joi.string().required().messages({
      "string.empty": "Password reset token is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
  }),
  verifyMail: Joi.object({
    email: Joi.string().email().messages({
      "string.email": "Please enter a valid email address.",
    }),
    code: Joi.string().messages({
      "string.empty": "Verification code cannot be empty.",
    }),
  }),
  sendVerifyMail: Joi.object({
    email: Joi.string().email().messages({
      "string.email": "Please enter a valid email address.",
    }),
  }),
  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required.",
    }),
  }),
  refreshToken: Joi.object({
    token: Joi.string().required().messages({
      "string.empty": "Refresh token is required.",
    }),
  }),
  register: Joi.object({
    firstName: Joi.string().min(2).required().messages({
      "string.empty": "First name is required.",
      "string.min": "First name must be at least 2 characters long.",
    }),
    lastName: Joi.string().min(2).required().messages({
      "string.empty": "Last name is required.",
      "string.min": "Last name must be at least 2 characters long.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required.",
    }),
    username: Joi.string().alphanum().min(3).required().messages({
      "string.empty": "Username is required.",
      "string.min": "Username must be at least 3 characters long.",
      "string.alphanum": "Username must contain only alphanumeric characters.",
    }),
    phone: Joi.string()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.empty": "Phone number is required.",
        "string.pattern.base": "Phone number must contain only numbers.",
      }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
    }),
  }),
};
