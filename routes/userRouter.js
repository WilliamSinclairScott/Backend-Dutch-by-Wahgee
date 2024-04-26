import express from 'express';
import {
  //TODO: Make functions in userController.js

} from '../controllers/userController.js';

const userRouter = express.Router();

// GET all users
userRouter.get('/', );

// GET a specific user
userRouter.get('/:id',);

// CREATE a new user
userRouter.post('/',);

// UPDATE an existing user
userRouter.put('/:id',);

// DELETE an user
userRouter.delete('/:id',);

export default userRouter;