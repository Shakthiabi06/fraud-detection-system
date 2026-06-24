import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { analyticsData } from '../../mock/sampleData';

// Registering core Chart.js structures explicitly to prevent runtime engine crashes
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function FraudTrendChart() {
  const data = {
    labels: analyticsData.monthlyTrends.labels,
    datasets: [
      {
        type: 'line',
        label: 'Fraud Incidents',
        data: analyticsData.monthlyTrends.fraudCounts,
        borderColor: '#26d7e8', // --cyan
        backgroundColor: 'rgba(38, 215, 232, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        type: 'bar',
        label: 'Total Volume',
        data: analyticsData.monthlyTrends.legitimateCounts,
        backgroundColor: 'rgba(45, 125, 255, 0.2)', // --blue-primary with opacity
        borderRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#a7b2d0', font: { family: 'Inter' } }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#6e7895' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#26d7e8' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#4ea1ff' }
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Chart type='bar' data={data} options={options} />
    </div>
  );
}