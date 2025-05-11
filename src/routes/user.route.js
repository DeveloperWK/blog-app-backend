import { Router } from "express";
import {
  deleteUser,
  getAllWriters,
  getUser,
  searchWriter,
  updateUser,
} from "../controllers/users/user.controller.js";
import authenticateJWT from "../middleware/auth.middleware.js";

const router = Router();
router
  .get("/writers", getAllWriters)
  .get("/search/writer", searchWriter)
  .get("/:id", authenticateJWT, getUser)
  .patch("/:id", authenticateJWT, updateUser)
  .patch("/2fa/:id", authenticateJWT, updateUser)
  .delete("/:id", authenticateJWT, deleteUser);

export default router;
