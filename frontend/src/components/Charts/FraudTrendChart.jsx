import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FraudTrendChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Fraud Alerts",
        data: [12, 19, 8, 15, 25, 18, 30],
        borderColor: "#2D7DFF",
        backgroundColor: "#2D7DFF",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#FFFFFF",
        },
      },

      title: {
        display: false,
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#A7B2D0",
        },

        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },

      y: {
        ticks: {
          color: "#A7B2D0",
        },

        grid: {
          color: "rgba(255,255,255,0.05)",
        },

        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        height: "350px",
        width: "100%",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}