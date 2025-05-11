import speakeasy from "speakeasy";
import User from "../../models/User.model.js";
import imageUploadService from "../../services/image-upload.service.js";
import resetPassLink from "../../services/reset-pass-link.service.js";
import sendLoginNotificationService from "../../services/sendLoginNotification.service.js";
import twoFactorAuthOtp from "../../services/twoFactorAuth.service.js";
import userWelcomeMail from "../../services/user-welcome-mail.service.js";
import verifyOtpSend from "../../services/verifyOtpSend.service.js";
import setCookie from "../../utils/cookie.js";
import generateOtp from "../../utils/generateOtp.js";
import generateToken from "../../utils/generateToken.js";
import { encrypt, passwordHash } from "../../utils/hash.js";
import loginInfo from "../../utils/loginInfo.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendSchema,
  verifyOtpSchema,
} from "./auth.validator.js";

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      country,
      role,
      bio,
      occupation,
    } = req.body;
    const file = req.file;
    const fileUrl = await imageUploadService(file);
    const userCheck = await User.findOne({ email });
    if (userCheck) return res.json({ message: "User already exists" });
    const otp = generateOtp(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const otpSecret = speakeasy.generateSecret();
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      country,
      role,
      bio,
      avatar: fileUrl,
      otp,
      otpExpiry,
      otpSecret: otpSecret.base32,
      occupation,
    });
    await user.save();
    await verifyOtpSend(email, otp);
    res.status(200).json({ message: "OTP sent. Please verify your email." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });
    const { userAgent, ip } = await loginInfo(req);
    if (user.is2FAEnabled) {
      const otp = speakeasy.totp({
        secret: user.otpSecret,
        encoding: "base32",
      });
      await twoFactorAuthOtp(email, otp);
      res.status(202).json({
        message: "OTP sent. Please verify your 2FA.",
        is2FAEnabled: user.is2FAEnabled,
      });
    } else if (user.otpVerified) {
      const token = generateToken(user);
      setCookie(res, [
        {
          name: "token",
          value: token,
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          },
        },
        {
          name: "role",
          value: user?.role,
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          },
        },
      ]);
      await sendLoginNotificationService(email, ip, userAgent);
      res.status(200).json({
        message: "Login successful",
        token,
        role: user.role,
        userId: user._id,
      });
    } else {
      res
        .status(401)
        .json({ message: "User not verified Please verify your email" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const verifyOtp = async (req, res) => {
  const { error } = verifyOtpSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { otp, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.otpVerified)
      return res.status(401).json({ message: "User already verified" });
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.otp !== otp || user.otpExpiry < new Date())
      return res.status(401).json({ message: "Invalid or Expired OTP" });
    await user.updateOne({ otp: null, otpExpiry: null, otpVerified: true });
    await userWelcomeMail(email, user?.firstName);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const twoFactorAuth = async (req, res) => {
  const { error } = verifyOtpSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    const { userAgent, ip } = await loginInfo(req);
    if (!user) return res.status(404).json({ message: "User not found" });
    const validOtp = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });
    if (!validOtp) return res.status(401).json({ message: "Invalid OTP" });
    const token = generateToken(user);
    setCookie(res, [
      {
        name: "token",
        value: token,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        },
      },
      {
        name: "role",
        value: user?.role,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        },
      },
    ]);
    await sendLoginNotificationService(email, ip, userAgent);
    res.status(200).json({
      message: "Login successful & OTP verified",
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const resendOtp = async (req, res) => {
  const { error } = resendSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otpVerified)
      return res.status(401).json({ message: "User already verified" });
    const otp = generateOtp(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.updateOne({ otp, otpExpiry });
    await verifyOtpSend(email, otp);
    res.status(200).json({ message: "OTP sent. Please verify your email." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const resetPasswordLink = async (req, res) => {
  const { error } = resendSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otpVerified) {
      const encryptedToken = encrypt(email);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.updateOne({
        encryptedToken: encryptedToken.encryptedData,
        encryptedTokenIv: encryptedToken.iv,
        otpExpiry,
      });
      await resetPassLink(email, encryptedToken.encryptedData);
      res.status(200).json({
        message:
          "Password Reset link sent to your email. Please check your email to reset your password.",
      });
    } else {
      return res.status(401).json({ message: "User not verified" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const changePassword = async (req, res) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { email, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });
    const hashedPassword = await passwordHash(newPassword);
    await user.updateOne({ password: hashedPassword });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const forgotPassword = async (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { token } = req.query;
  const { password } = req.body;
  try {
    const user = await User.findOne({ encryptedToken: token });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otpExpiry < new Date())
      return res.status(401).json({ message: "password reset link expired" });
    const hashedPassword = await passwordHash(password);
    await user.updateOne({
      password: hashedPassword,
      encryptedToken: null,
      encryptedTokenIv: null,
      otpExpiry: null,
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
export {
  changePassword,
  forgotPassword,
  login,
  register,
  resendOtp,
  resetPasswordLink,
  twoFactorAuth,
  verifyOtp,
};
