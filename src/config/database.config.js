import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();

async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env._MONGO_URI);
    console.log("🍃 MongoDB connected");
  } catch (error) {
    console.error("Database error:", error.message);
  }
}
export default connectDB;
