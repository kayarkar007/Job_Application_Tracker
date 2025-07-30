import Job from "../models/Jobs.js";

// Create a new job application
const createJob = async (req, res) => {
  try {
    const { title, company, location, status, notes } = req.body;
    const newJob = new Job({
      title,
      company,
      location,
      status,
      notes,
      user: req.user._id,
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get all jobs for a user
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({
      dateApplied: -1,
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get a single job
const getJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Update a job application
const updateJob = async (req, res) => {
  try {
    const { title, company, location, status, notes } = req.body;
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, company, location, status, notes },
      { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Delete a job application
const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deletedJob) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.json({ msg: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get job statistics
const getJobStats = async (req, res) => {
  try {
    // Single aggregation query to get both stats and total
    const [stats, totalJobs] = await Promise.all([
      Job.aggregate([
        { $match: { user: req.user._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Job.countDocuments({ user: req.user._id }),
    ]);

    // Format stats
    const formattedStats = {
      total: totalJobs,
      byStatus: {},
    };

    stats.forEach((stat) => {
      formattedStats.byStatus[stat._id] = stat.count;
    });

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export { createJob, getJobs, getJob, updateJob, deleteJob, getJobStats };
