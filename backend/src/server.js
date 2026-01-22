import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import videoRoutes from "./routes/videoRoutes.js"
import path from "path"
import { apiLimiter } from "./middleware/rateLimiter.js"
import "./workers/videoWorker.js";


dotenv.config()
connectDB()

const app=express()

app.use(cors())
app.use(express.json())


app.use("/api",apiLimiter)

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Attaching auth routes
app.use("/api/auth",authRoutes)

// Attaching video routes
app.use("/api/videos",videoRoutes);







const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
})