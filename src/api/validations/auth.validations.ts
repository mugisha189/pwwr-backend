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
    name: Joi.string().min(2).required().messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 2 characters long.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
    }),
  }),
};
