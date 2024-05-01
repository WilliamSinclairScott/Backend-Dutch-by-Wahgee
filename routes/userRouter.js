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
userRouter.post('/signup', signup); //

//login
userRouter.post('/login', login);

// get all divvys by a user
userRouter.get('/:userId/divvys', getDivvysByUserId); 

// get a user by ID
userRouter.get('/:id', getUserById);

// update a user
userRouter.patch('/:id' ,updateUserById); //


// delete a user 
userRouter.delete('/:id', authCheck ,deleteUserById);

export default userRouter;