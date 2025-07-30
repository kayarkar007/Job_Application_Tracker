import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["applied", "interview", "offer", "rejected", "saved"],
    default: "applied",
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Add index for faster queries
  },
});

// Add compound index for user + status for faster stats queries
jobSchema.index({ user: 1, status: 1 });

export default mongoose.model("Job", jobSchema);
