import express from 'express';
import { UserController } from './controllers/userController.js';

export const router = express.Router();
const userController = new UserController();

// User routes
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
