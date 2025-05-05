import {Router} from 'express';
import {getAllComments, getAllUsers} from "../controllers/admins/admin.controller.js";

const router = Router();
router
    .get('/users', getAllUsers)
    .get('/comments', getAllComments)

export default router;