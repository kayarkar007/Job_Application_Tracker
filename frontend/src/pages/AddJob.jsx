import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobsAPI } from "../services/api";

const AddJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    status: "applied",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await jobsAPI.createJob(formData);
      navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent w-full min-h-[90vh] flex justify-center items-start pt-10 px-4 sm:px-6 lg:px-8">
      <div className="content w-full max-w-2xl min-h-[300px] border border-gray-200 rounded-xl shadow bg-white p-4 sm:p-5">
        <div className="title text-lg sm:text-xl font-medium mb-4">Add New Job Application</div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="inputs grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="position flex flex-col">
              <label className="font-medium" htmlFor="title">Position *</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="border border-gray-200 rounded-lg px-2 py-1 mt-1 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Software Engineer" required />
            </div>
            <div className="position flex flex-col">
              <label className="font-medium" htmlFor="company">Company *</label>
              <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="border border-gray-200 rounded-lg px-2 py-1 mt-1 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tech Corp" required />
            </div>
            <div className="position flex flex-col">
              <label className="font-medium" htmlFor="location">Location</label>
              <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="border border-gray-200 rounded-lg px-2 py-1 mt-1 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="San Francisco, CA" />
            </div>
            <div className="position flex flex-col">
              <label className="font-medium" htmlFor="status">Status</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 px-2 py-1.5 text-[14px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="applied">Applied</option>
                <option value="interview">Interviewing</option>
                <option value="offer">Offered</option>
                <option value="rejected">Rejected</option>
                <option value="saved">Saved</option>
              </select>
            </div>
          </div>

          <div className="Notes flex flex-col mt-4">
            <label className="font-medium" htmlFor="notes">Notes</label>
            <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows="4" className="border border-gray-200 rounded-lg px-2 py-1 mt-1 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Interview notes, follow-up reminders, etc." />
          </div>

          <div className="buttons mt-6 flex flex-col sm:flex-row justify-end gap-2">
            <button type="button" className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => navigate("/jobs")}>Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 border border-blue-100 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Adding..." : "Add Job"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
