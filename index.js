import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js"

dotenv.config()

const app=express()

app.use (express.json())

app.use(cors())


app.use("/api/auth",authRoutes)
app.use("/api/interview",interviewRoutes)


app.get("/",(req,res)=>{
    res.json({message:"api working"})
    console.log("test route")
})

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongodb connected")
    const port=process.env.PORT||5000
    app.listen(process.env.PORT||5000,()=>{
        console.log(`app listening on port:${port}`)
    })
}).catch((err)=>console.log(err))

