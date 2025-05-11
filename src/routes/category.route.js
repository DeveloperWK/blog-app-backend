import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categories/category.controller.js";
import authenticateJWT from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/RBAC/rbac.middleware.js";
const router = Router();
router
  .get("", getCategories)
  .post("", authenticateJWT, isAdmin, createCategory)
  .patch("/:id", authenticateJWT, isAdmin, updateCategory)
  .delete("/:id", authenticateJWT, isAdmin, deleteCategory);
export default router;
