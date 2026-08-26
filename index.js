import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: 'https://mock-prep-ai-frontend.vercel.app',
    credentials: true,
}));


app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

console.log("Registered routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});

app.get("/", (req, res) => {
    res.json({ message: "API working" });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    })
    .catch((err) => console.log("Database connection error:", err));