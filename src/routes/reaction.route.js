import { Router } from "express";
import {
  createReactToBlog,
  getBlogReactions,
} from "../controllers/reactions/reaction.controller.js";
import authenticateJWT from "../middleware/auth.middleware.js";

const router = Router();
router
  .post("/:blogId", authenticateJWT, createReactToBlog)
  .get("/:blogId", getBlogReactions);

export default router;
