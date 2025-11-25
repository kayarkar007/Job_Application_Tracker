import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.login(loginData);
      login(response.data.user, response.data.token);
      navigate("/dashboard");
      // console.log("Login Data:", loginData); // This log is fine but more useful after success.
    } catch (err) {
      console.error("Login failed:", err); // Add this for debugging
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 opacity-30 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-40 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <form
        className="relative z-10 bg-white/90 backdrop-blur-lg p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-blue-100"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 p-2 sm:p-3 rounded-full shadow-lg mb-2">
            <svg
              width="32"
              height="32"
              className="sm:w-10 sm:h-10"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" fill="#fff" />
              <ellipse cx="12" cy="17" rx="7" ry="4" fill="#fff" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-1">Welcome Back</h2>
          <p className="text-gray-500 text-xs sm:text-sm text-center">Sign in to continue your job search journey!</p>
        </div>
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>
        )}
        <button
          className="mt-8 w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-base sm:text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm">Don't have an account? <a href="/signup" className="text-blue-600 font-semibold hover:underline transition">Sign Up</a></div>
      </form>
    </div>
  );
};

export default Login;
