import express from 'express';

//TODO: Add auth to router options
import {
  //TODO: Make functions in userController.js
  updateUserById,

} from '../controllers/userController.js';
import {
  signup,
  login
} from '../controllers/authController.js'
import authCheck from '../utils/auth.js'

const userRouter = express.Router();

//signup
userRouter.post('/signup', signup);

//login
userRouter.post('/login', login);

// update a user
userRouter.patch('/:id', authCheck ,updateUserById);

export default userRouter;