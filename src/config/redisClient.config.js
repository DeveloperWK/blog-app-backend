import { configDotenv } from "dotenv";
import { Redis } from "ioredis";
configDotenv();
const redisClientConfig = new Redis(process.env._REDIS_URL);

redisClientConfig.on("connect", () => {
  console.log("🍃 Redis connected");
});
redisClientConfig.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});
process.on("SIGINT", async () => {
  console.log("Closing Redis connection...");
  await redisClientConfig.quit();
  process.exit(0);
});

export default redisClientConfig;
