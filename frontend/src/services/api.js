import axios from "axios";

// Use Vite environment variable `VITE_API_URL` in production/deployments.
// Set `VITE_API_URL` to the backend base URL without a trailing slash, e.g.
// https://my-backend.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

// Jobs API
export const jobsAPI = {
  getJobs: () => api.get("/jobs"),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post("/jobs", jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getStats: () => api.get("/jobs/stats"),
};

export default api;
