import {Router} from 'express';
import {createReactToBlog, getBlogReactions} from "../controllers/reactions/reaction.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();
router
    .post('/:blogId', authMiddleware, createReactToBlog)
    .get('/:blogId', getBlogReactions);

export default router;