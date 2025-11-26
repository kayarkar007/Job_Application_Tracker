import React, { useState, useEffect } from "react";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import { jobsAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        // console.warn("Dashboard loading timeout");
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeout);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await jobsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to fetch dashboard data. Please try again later.");
      // Set default stats if API fails
      setStats({
        total: 0,
        byStatus: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Applications",
      count: stats.total,
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: "Interviews Scheduled",
      count: stats.byStatus.interview || 0,
      icon: (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      title: "Offers Received",
      count: stats.byStatus.offer || 0,
      icon: (
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 17l-5 3 1.9-5.6L4 10.5l5.7-.4L12 5l2.3 5.1 5.7.4-4.9 3.9L17 20z" />
        </svg>
      ),
    },
    {
      title: "Rejections",
      count: stats.byStatus.rejected || 0,
      icon: (
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  ];

  const chartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected", "Saved"],
    datasets: [
      {
        label: "Job Applications",
        data: [
          stats.byStatus.applied || 0,
          stats.byStatus.interview || 0,
          stats.byStatus.offer || 0,
          stats.byStatus.rejected || 0,
          stats.byStatus.saved || 0,
        ],
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#facc15",
          "#ef4444",
          "#8b5cf6",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Job Application Status Overview",
        color: "#333",
        font: {
          size: 18,
        },
      },
    },
  };
  if (loading) {
    return (
      <div className="text-black flex flex-col items-center justify-center min-h-[90vh] bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-xl text-gray-600">Loading dashboard...</div>
          <div className="text-sm text-gray-500">Please wait while we fetch your data</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-black flex flex-col items-center justify-center min-h-[90vh] bg-white">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="text-black flex flex-col items-center justify-start min-h-[90vh] bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">Dashboard</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-2">Track your job applications and analyze your progress.</p>
      </div>
      <div className="stat_box w-full max-w-7xl mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsData.map((stat) => (
          <div key={stat.title} className="flex flex-col items-center justify-center h-24 sm:h-32 border border-gray-200 rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition-shadow duration-200 p-4">
            <div className="mb-2">{stat.icon}</div>
            <div className="title text-xs sm:text-sm font-medium text-gray-600 text-center">{stat.title}</div>
            <div className="count text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.count}</div>
          </div>
        ))}
      </div>
      <div className="charts mt-10 sm:mt-20 flex flex-col lg:flex-row w-full max-w-7xl gap-6">
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow w-full lg:w-[49%] border border-gray-200 flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
          <BarChart data={chartData} options={options} />
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow w-full lg:w-[49%] border border-gray-200 flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
          <PieChart
            data={chartData}
            options={{
              ...options,
              title: {
                ...options.title,
                text: "Job Application Status Distribution",
              },
              plugins: {
                ...options.plugins,
                title: {
                  ...options.plugins.title,
                  text: "Job Application Status Distribution",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
