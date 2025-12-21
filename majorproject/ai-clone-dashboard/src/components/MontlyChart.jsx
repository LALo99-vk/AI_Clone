// ai-clone-dashboard-frontend/src/components/MonthlyChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// 1. Register Chart.js components (necessary setup)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define Chart Data and Options
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  datasets: [
    {
      label: 'Performance Index',
      // Mock data mirroring the "predicted slight dip"
      data: [75, 80, 85, 90, 88, 80, 75, 78, 82, 79], 
      borderColor: '#5b67e0', // Color matching your dashboard style
      backgroundColor: 'rgba(91, 103, 224, 0.4)', 
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#5b67e0',
    },
  ],
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
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
                display: false
            }
        },
        y: {
            min: 50,
            max: 100,
            title: {
                display: true,
                text: 'Performance %',
                color: '#555'
            },
            ticks: {
                stepSize: 10,
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            }
        }
    }
};

const MonthlyChart = () => {
  return (
    // Set a fixed height for the container to ensure the chart renders correctly
    <div style={{ position: 'relative', height: '350px', width: '100%' }}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default MonthlyChart;