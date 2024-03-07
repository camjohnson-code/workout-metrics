import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const LineChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 4,
    plugins: {
      gradient: true,
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
          grid: {
            display: false,
          },
      },
      y: {
        min: 0,
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
