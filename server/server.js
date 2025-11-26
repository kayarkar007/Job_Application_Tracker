import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authroutes.js";
import jobRoutes from "./routes/jobRoutes.js";

// Load environment variables from .env file
dotenv.config();

// --- Configuration ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173', // Always allow local development frontend
];

if (process.env.FRONTEND_URL) {
  const frontendUrls = process.env.FRONTEND_URL.split(',').map(origin => origin.trim());
  allowedOrigins.push(...frontendUrls);
}

// Log a warning if no production frontend URL is configured
if (NODE_ENV !== 'development' && !process.env.FRONTEND_URL) {
    console.warn('WARNING: No FRONTEND_URL environment variable set. Deployed frontend might be blocked by CORS.');
}

console.log("CORS allowed origins:", allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};


// --- Express App Initialization ---
const app = express();

// --- Middleware ---
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// --- Health Check Endpoint ---
app.get("/", (req, res) => {
  res.status(200).send("API is running and healthy ✅");
});

// --- Database Connection and Server Start ---
const startServer = async () => {
  if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI environment variable is not set.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // Fail fast if connection is not established
      socketTimeoutMS: 45000,
    });
    console.log("✅ Successfully connected to MongoDB.");

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

// --- Graceful Shutdown ---
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Closing connections...`);
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown('SIGINT'));
process.on("SIGTERM", () => gracefulShutdown('SIGTERM'));

// --- Start the application ---
startServer();
