import joi from "joi";

const registerSchema = joi
  .object({
    firstName: joi
      .string()
      .required()
      .regex(/^[a-zA-Z\s]*$/)
      .min(2)
      .max(50),
    lastName: joi.string(),
    email: joi
      .string()
      .email()
      .regex(/^[a-z0-9]+([.-]?[a-z0-9]+)*@[a-z]+([.-]?[a-z]+)*(\.[a-z]{2,3})+$/)
      .required(),
    password: joi.string().required().min(6),
    confirmPassword: joi.ref("password"),
    country: joi.string().default("Bangladesh"),
    role: joi
      .string()
      .default("user")
      .valid("user", "admin", "writer", "moderator"),
    bio: joi.string().max(150),
    occupation: joi.string().required(),
  })
  .unknown();
const loginSchema = joi.object({
  email: joi
    .string()
    .email()
    .regex(/^[a-z0-9]+([.-]?[a-z0-9]+)*@[a-z]+([.-]?[a-z]+)*(\.[a-z]{2,3})+$/)
    .required(),
  password: joi.string().required().min(6),
});
const verifyOtpSchema = joi.object({
  otp: joi.string().required().min(6).max(6),
  email: joi
    .string()
    .email()
    .regex(/^[a-z0-9]+([.-]?[a-z0-9]+)*@[a-z]+([.-]?[a-z]+)*(\.[a-z]{2,3})+$/)
    .required(),
});
const resendSchema = joi.object({
  email: joi
    .string()
    .email()
    .regex(/^[a-z0-9]+([.-]?[a-z0-9]+)*@[a-z]+([.-]?[a-z]+)*(\.[a-z]{2,3})+$/)
    .required(),
});
const changePasswordSchema = joi.object({
  email: joi
    .string()
    .email()
    .regex(/^[a-z0-9]+([.-]?[a-z0-9]+)*@[a-z]+([.-]?[a-z]+)*(\.[a-z]{2,3})+$/)
    .required(),
  currentPassword: joi.string().required().min(6),
  newPassword: joi.string().required().min(6),
  confirmPassword: joi.ref("newPassword"),
});
const forgotPasswordSchema = joi.object({
  password: joi.string().required().min(6),
});
export {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendSchema,
  verifyOtpSchema,
};
