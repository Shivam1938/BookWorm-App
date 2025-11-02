import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import job from "./utils/cron.js"

const app = express()

job.start()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.route.js'
import bookRouter from './routes/book.route.js'

//routes declaration
app.use("/api/auth", userRouter)
app.use("/api/books", bookRouter)

export { app }