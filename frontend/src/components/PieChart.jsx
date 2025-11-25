import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Pie chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, options }) => {
  return <Pie data={data} options={options} />;
};

export default PieChart;
