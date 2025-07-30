import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authroutes.js";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // or whatever port your React frontend runs on
    credentials: true,
  })
);

app.use(express.json());
console.log("Starting server...");
mongoose
  .connect(process.env.MONGO_URI, {
    // Add connection options for better performance
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // bufferMaxEntries: 0,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
