import {Router} from 'express';
import {deleteUser, getAllWriters, getUser, searchWriter, updateUser} from "../controllers/users/user.controller.js";

const router = Router();
router
    .get('/writers', getAllWriters)
    .get('/search/writer', searchWriter)
    .get('/:id', getUser)
    .patch('/:id', updateUser)
    .patch('/2fa/:id', updateUser)
    .delete('/:id', deleteUser)

export default router;