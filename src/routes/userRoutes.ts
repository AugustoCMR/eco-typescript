import express from 'express';
import { UserController } from '../controllers/userController';

const router = express.Router();
const userController = new UserController();

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);

export default router;
