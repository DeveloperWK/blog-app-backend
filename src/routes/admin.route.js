import { Router } from "express";
import {
  getAllComments,
  getAllUsers,
} from "../controllers/admins/admin.controller.js";
import authenticateJWT from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/RBAC/rbac.middleware.js";

const router = Router();
router
  .get("/users", authenticateJWT, isAdmin, getAllUsers)
  .get("/comments", authenticateJWT, isAdmin, getAllComments);

export default router;
