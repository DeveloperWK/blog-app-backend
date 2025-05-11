import { Router } from "express";
import {
  addBookMark,
  getAllBookMark,
  removeBookMark,
} from "../controllers/bookMarks/bookMark.controller.js";

const router = Router();
router
  .post("", addBookMark)
  .get("/:usersId", getAllBookMark)
  .delete("/:blogId", removeBookMark);

export default router;
