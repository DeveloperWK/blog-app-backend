import { compare, genSalt, hash } from "bcryptjs";
import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      matches: [
        /^[a-zA-Z\s]*$/,
        "First name can only contain letters and spaces",
      ],
    },
    lastName: {
      types: String,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      immutable: true,
      match: [
        /^[a-z0-9]+([.-]?[a-z0-9]+)*@[a-z]+([.-]?[a-z]+)*(\.[a-z]{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    country: {
      type: String,
      default: "Bangladesh",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "writer", "moderator"],
      default: "user",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    otpSecret: { type: String },
    is2FAEnabled: { type: Boolean, default: false },
    occupation: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      maxlength: [150, "Bio cannot exceed 150 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
    encryptedToken: {
      type: String,
      default: null,
    },
    encryptedTokenIv: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
};
UserSchema.index(
  {
    firstName: "text",
    lastName: "text",
    role: 1,
  },
  {
    weights: {
      firstName: 10,
      lastName: 1,
    },
    name: "writerSearch",
  }
);
const User = mongoose.models.User || model("User", UserSchema);
export default User;
