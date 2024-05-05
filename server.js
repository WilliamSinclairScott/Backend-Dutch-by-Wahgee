import "dotenv/config.js"

//Module imports
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from 'morgan'

//Route imports
import userRouter from './routes/userRouter.js'
import divvyRouter from './routes/divvyRouter.js'

//initialize variables
const PORT = process.env.PORT || 7777
const corsOptions = { 
  //!!Temporary unsecure fast and loose CORS policy
  origin: [['http://localhost:5173', 
  'https://frontend-dutch-by-wahgee.vercel.app',
  'dutch.webdevstuff.ninja']], 
  credentials: true
}
const app = express()

//mongoose connection
try {
  await mongoose.connect(process.env.DATABASE_URL)
  console.log("Connected to MongoDB")
} catch (error) {
  console.log("Error connecting to MongoDB")
  console.log(error)
}

//middleware
app.use(express.json())
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(cookieParser())

//Use Routes
app.use('/user', userRouter)
app.use('/divvy', divvyRouter)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
