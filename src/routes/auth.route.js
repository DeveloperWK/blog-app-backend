import { Router } from "express";
import upload from "../config/multer.config.js";
import {
  changePassword,
  forgotPassword,
  login,
  register,
  resendOtp,
  resetPasswordLink,
  twoFactorAuth,
  verifyOtp,
} from "../controllers/auth/auth.controller.js";
import authenticateJWT from "../middleware/auth.middleware.js";
const router = Router();

router
  .post("/register", upload.single("avatar"), register)
  .post("/login", login)
  .post("/verify", verifyOtp)
  .post("/two-factor-auth", twoFactorAuth)
  .post("/resend-otp", resendOtp)
  .post("/reset-password-link", resetPasswordLink)
  .patch("/forgot-password", forgotPassword)
  .patch("/change-password", authenticateJWT, changePassword);

export default router;
