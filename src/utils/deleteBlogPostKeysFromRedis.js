// import redisClientConfig from "../config/redisClient.config.js";

// const deleteBlogPostsKeysFromRedis = async () => {
//   try {
//     const keys = await redisClientConfig.keys("blog-posts:*");
//     if (keys.length > 0) {
//       await redisClientConfig.del(keys);
//     }
//   } catch (error) {
//     console.error("Error deleting Redis keys:", error);
//   }
// };

// const deleteBlogPostKeysFromRedis = async (id) => {
//   try {
//     const keys = await redisClientConfig.keys(`blog-post:${id}`);
//     if (keys.length > 0) {
//       await redisClientConfig.del(keys);
//     }
//   } catch (error) {
//     console.error("Error deleting Redis keys:", error);
//   }
// };

// export { deleteBlogPostKeysFromRedis, deleteBlogPostsKeysFromRedis };
