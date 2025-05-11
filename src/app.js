import cors from "cors";
import express from "express";
import nodeApiGuard from "node-api-guard";
import errorHandler from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";
import adminRoute from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import blogPostRoute from "./routes/blogPost.route.js";
import bookMarkRoute from "./routes/bookMarkRoute.route.js";
import categoryRoute from "./routes/category.route.js";
import commentRoute from "./routes/comment.route.js";
import reactionRoute from "./routes/reaction.route.js";
import userRoute from "./routes/user.route.js";
/*
We're using node-api-guard, my custom NPM middleware package, to add powerful security features to our API...
1.Rate Limiting (100 requests per minute)
2.Logging
---Other features are not used for now---
*/

// App Init

const APP = express();
APP.use(express.json())
  .use(
    cors({
      origin: process.env._CLIENT_URL,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    })
  )
  .use(
    nodeApiGuard({
      enableLogging: true,
      rateLimit: {
        maxRequests: 100,
        timeWindow: 60 * 1000,
      },
    })
  )
  // .use(helmet())
  .disable("x-powered-by");

// Routes
APP.use("/api/v1/auth", authRoutes)
  .use("/api/v1/users", userRoute)
  .use("/api/v1/blog-post", blogPostRoute)
  .use("/api/v1/categories", categoryRoute)
  .use("/api/v1/comments", commentRoute)
  .use("/api/v1/reactions", reactionRoute)
  .use("/api/v1/admin", adminRoute)
  .use("/api/v1/bookmark", bookMarkRoute);

// Error Handling Middleware
APP.use(notFoundMiddleware).use(errorHandler);

export default APP;
