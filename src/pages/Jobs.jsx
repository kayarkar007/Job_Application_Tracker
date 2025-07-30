import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { LuFilter } from "react-icons/lu";
import { IoTrashOutline, IoPencilOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { jobsAPI } from "../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn("Jobs loading timeout");
      setLoading(false);
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeout);
  });

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getJobs();
      setJobs(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Set empty array if API fails
      setJobs([]);
      setError("Failed to load job applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (
      window.confirm("Are you sure you want to delete this job application?")
    ) {
      try {
        await jobsAPI.deleteJob(jobId);
        setJobs(jobs.filter((job) => job._id !== jobId));
        setError(null);
      } catch (error) {
        console.error("Error deleting job:", error);
        setError("Failed to delete job application. Please try again.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-green-100 text-green-800";
      case "offer":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "saved":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-black flex flex-col items-center justify-center min-h-[90vh] bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-xl text-gray-600">Loading jobs...</div>
          <div className="text-sm text-gray-500">
            Please wait while we fetch your job applications
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-black flex flex-col items-center justify-start min-h-[90vh] bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
            Job Applications
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-2">
            Manage your job applications and track their progress
          </p>
        </div>
        <Link
          to="/add-job"
          className="w-full sm:w-auto border bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          + Add Job
        </Link>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="searchBarSection w-full max-w-7xl flex flex-col sm:flex-row gap-4 mt-4">
        <div className="searchbar flex pl-2 w-full sm:w-[70%] h-10 border border-gray-300 rounded-lg items-center">
          <label htmlFor="searchicon">
            <IoSearch className="w-4 h-4" />
          </label>
          <input
            type="search"
            name="Search"
            id="search"
            placeholder="Search by position or company..."
            className="ml-2 w-full h-auto border-none outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter flex w-full sm:w-[30%] h-10 items-center">
          <label htmlFor="filtericon" className="mr-2">
            <LuFilter />
          </label>
          <select
            name="filter"
            id="filter"
            className="border border-gray-300 rounded-lg px-2 h-full outline-none w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="interview">Interviewing</option>
            <option value="offer">Offered</option>
            <option value="rejected">Rejected</option>
            <option value="saved">Saved</option>
          </select>
        </div>
      </div>

      <div className="jobs-list w-full max-w-7xl mt-8">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {jobs.length === 0
              ? "No job applications yet. Add your first job!"
              : "No jobs match your search criteria."}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-2">
                      {job.company}
                    </p>
                    {job.location && (
                      <p className="text-sm sm:text-base text-gray-500 mb-2">
                        {job.location}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {job.status.charAt(0).toUpperCase() +
                          job.status.slice(1)}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        Applied:{" "}
                        {new Date(job.dateApplied).toLocaleDateString()}
                      </span>
                    </div>
                    {job.notes && (
                      <p className="text-gray-600 mt-3 text-xs sm:text-sm">
                        {job.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 self-start sm:self-center">
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <IoTrashOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <Link
                      to={`/edit-job/${job._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <IoPencilOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
