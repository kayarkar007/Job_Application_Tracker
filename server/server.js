import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authroutes.js";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

if (!process.env.MONGO_URI) {
  console.error(
    "Missing required environment variable: MONGO_URI. Add it to your .env or hosting environment and restart."
  );
  process.exit(1);
}

const allowedFrontend = process.env.FRONTEND_URL || "http://localhost:5173";
console.log("Configured frontend origin for CORS:", allowedFrontend);

app.use(
  cors({
    origin: allowedFrontend,
    credentials: true,
  })
);

app.use(express.json());

const start = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB");

    app.use("/api/auth", authRoutes);
    app.use("/api/jobs", jobRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("API is working ✅");
});

start();
