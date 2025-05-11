import { Router } from "express";
import upload from "../config/multer.config.js";
import {
  blogPostsSearch,
  createBlogPost,
  deleteBlogPost,
  getBlogPost,
  getBlogPostByWriter,
  getBlogPosts,
  updateBlogPost,
  updateImage,
} from "../controllers/blogPosts/blogPost.controller.js";
import authenticateJWT from "../middleware/auth.middleware.js";
import { isWriter } from "../middleware/RBAC/rbac.middleware.js";

const router = Router();
router
  .post("", authenticateJWT, isWriter, upload.single("image"), createBlogPost)
  .get("/search-posts", blogPostsSearch)
  .get("/writer/:id", authenticateJWT, isWriter, getBlogPostByWriter)
  .get("/:id", getBlogPost)
  .get("", getBlogPosts)
  .patch("/:id", authenticateJWT, isWriter, updateBlogPost)
  .patch(
    "/update-image/:id",
    authenticateJWT,
    isWriter,
    upload.single("image"),
    updateImage
  )
  .delete("/:id", authenticateJWT, isWriter, deleteBlogPost);

export default router;
