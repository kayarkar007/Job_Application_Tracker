import express from "express";
import cors from "cors";

const app = express();

// Example array of allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-application-tracker-krqwwuvhh-pks-projects-42493aab.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// your other app.use and routes here

export default app;
