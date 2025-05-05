import { genSalt, hash } from "bcryptjs";
import { configDotenv } from "dotenv";
import crypto from "node:crypto";
configDotenv();
const key = Buffer.from(process.env._HASH_KEY, "hex");
const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
};
const passwordHash = async (pass) => {
  const salt = await genSalt(10);
  return await hash(pass, salt);
};
export { encrypt, passwordHash };
