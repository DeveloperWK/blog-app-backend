import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comments/comment.controller.js";
import authenticateJWT from "../middleware/auth.middleware.js";

const router = Router();
router
  .post("", authenticateJWT, createComment)
  .get("/:blogId", getComments)
  .patch("/:id", authenticateJWT, updateComment)
  .delete("/:id", authenticateJWT, deleteComment);
export default router;
