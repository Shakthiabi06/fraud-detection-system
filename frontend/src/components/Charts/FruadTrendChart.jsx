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
    labels: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],

    datasets: [
      {
        label: "Fraud Alerts",
        data: [12, 19, 8, 15, 25, 18, 30],
        borderColor: "#2D7DFF",
        backgroundColor: "#4EA1FF",
        tension: 0.4,
      },
    ],
  };

  return <Line data={data} />;
}