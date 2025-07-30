import express from "express";
import auth from "../middleware/auth.js";
// console.log("Inside jobRoutes before defining routes");

import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobStats,
} from "../controllers/jobController.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Job routes
router.post("/", createJob);
router.get("/", getJobs);
router.get("/stats", getJobStats);
router.get("/:id", getJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
