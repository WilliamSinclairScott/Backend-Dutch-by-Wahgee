import express from 'express'

const authRouter = express.Router()

//Import Auth controller
//TODO: Make signup, login, logout functions in authController.js
import {signup, login, logout } from "../controllers/authController.js"
import { authCheck } from '../utils/auth.js'

// Allow a user to login

authRouter.post('/login', login)

// Allow a user to signup

authRouter.post('/signup', signup)

// Allow a user to logout

authRouter.get('/logout', authCheck, logout)

export default authRouter