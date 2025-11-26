import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import authRoutes from "./routes/authroutes.js";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

const parseAllowedOrigins = (origins) => {
  if (!origins) {
    return ["http://localhost:5173"];
  }
  return origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins(process.env.FRONTEND_URL);
console.log("Configured frontend origin(s) for CORS:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`Request from origin: ${origin}`);
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production') {
        // Allow all origins in non-production environments
        return callback(null, true);
      }
      return callback(
        new Error(
          `Origin ${origin} not allowed. Update FRONTEND_URL env to include it.`
        )
      );
    },
    credentials: true,
  })
);

app.use(express.json());

let memoryServer = null;

const isValidMongoUri = (uri) => {
  if (!uri) return false;
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
};

const connectToDatabase = async (uri) => {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log("Connected to MongoDB");
};

const provisionInMemoryMongo = async () => {
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  console.warn(
    "Data will be lost when the server restarts. Provide MONGO_URI for persistent storage."
  );
  return uri;
};

const start = async () => {
  let mongoUri = null;

  try {
    if (isValidMongoUri(process.env.MONGO_URI)) {
      mongoUri = process.env.MONGO_URI;
    } else {
      console.warn(
        "Valid MONGO_URI not provided. Falling back to in-memory MongoDB for development."
      );
      mongoUri = await provisionInMemoryMongo();
    }

    await connectToDatabase(mongoUri);
  } catch (err) {
    if (!memoryServer) {
      console.warn(
        `Failed to connect using provided MONGO_URI, retrying with in-memory MongoDB: ${err.message}`
      );
      try {
        mongoUri = await provisionInMemoryMongo();
        await connectToDatabase(mongoUri);
      } catch (memoryErr) {
        console.error("Failed to start in-memory MongoDB:", memoryErr.message);
        process.exit(1);
      }
    } else {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1);
    }
  }

  app.use("/api/auth", authRoutes);
  app.use("/api/jobs", jobRoutes);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

app.get("/", (req, res) => {
  res.send("API is working ✅");
});

start();

const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
