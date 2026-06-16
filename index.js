import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/interview", interviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
