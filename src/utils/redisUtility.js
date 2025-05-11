import redisClientConfig from "../config/redisClient.config.js";
const cacheData = async (key, data, ttl = 3600) => {
  try {
    await redisClientConfig.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error("Redis error:", error);
  }
};
const getCacheData = async (key) => {
  const data = await redisClientConfig.get(key);
  return data ? JSON.parse(data) : null;
};
export { cacheData, getCacheData };
