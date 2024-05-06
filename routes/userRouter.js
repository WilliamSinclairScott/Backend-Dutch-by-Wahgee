import express from 'express';

//TODO: Add auth to router options
import {
  //TODO: Make functions in userController.js
  getUserById,
  deleteUserById,
  getDivvysByUserId,
  updateUserById
} from '../controllers/userController.js';
import {
  signup,
  login
} from '../controllers/authController.js'

import { authCheck } from '../utils/auth.js'

const userRouter = express.Router();

//signup
userRouter.post('/signup', signup);

//login
userRouter.post('/login', login);

//not in use...
userRouter.get('/:userId/divvys', authCheck, getDivvysByUserId); 
userRouter.get('/:id', authCheck, getUserById);
userRouter.patch('/:id' ,authCheck, updateUserById);
userRouter.delete('/:id' ,authCheck, deleteUserById);

export default userRouter;