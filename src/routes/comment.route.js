import {Router} from 'express'
import {createComment, deleteComment, getComments, updateComment} from "../controllers/comments/comment.controller.js";

const router = Router()
router
    .post('', createComment)
    .get('/:blogId', getComments)
    .patch('/:id', updateComment)
    .delete('/:id', deleteComment)
export default router