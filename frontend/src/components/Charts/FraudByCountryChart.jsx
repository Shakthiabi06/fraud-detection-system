import { useMemo } from "react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FraudByCountryChart({ transactions = [] }) {
  const colors = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    const blue = styles.getPropertyValue("--blue").trim();
    const cyan = styles.getPropertyValue("--cyan").trim();
    const green = styles.getPropertyValue("--green").trim();
    const amber = styles.getPropertyValue("--amber").trim();
    const red = styles.getPropertyValue("--red").trim();
    const bgCard = styles.getPropertyValue("--bg-card").trim();
    const textSecondary = styles.getPropertyValue("--text-secondary").trim();

    return {
      sliceColors: [
        `color-mix(in srgb, ${blue} 72%, transparent)`,
        `color-mix(in srgb, ${cyan} 72%, transparent)`,
        `color-mix(in srgb, ${green} 68%, transparent)`,
        `color-mix(in srgb, ${amber} 72%, transparent)`,
        `color-mix(in srgb, ${red} 72%, transparent)`,
      ],
      bgCard,
      textSecondary,
    };
  }, []);

  // Calculate country distribution from real transactions
  const countryData = useMemo(() => {
    const counts = transactions.reduce((acc, txn) => {
      const country = txn.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    return { labels, data };
  }, [transactions]);

  const chartData = useMemo(
    () => ({
      labels: countryData.labels.length > 0 ? countryData.labels : ['No Data'],
      datasets: [
        {
          data: countryData.data.length > 0 ? countryData.data : [1],
          backgroundColor: colors.sliceColors,
          borderColor: colors.bgCard,
          borderWidth: 2,
        },
      ],
    }),
    [colors, countryData],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxHeight: 9,
            boxWidth: 9,
            color: colors.textSecondary,
            font: { family: "Inter", size: 11 },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(11, 16, 32, 0.94)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          borderWidth: 1,
          displayColors: false,
        },
      },
    }),
    [colors],
  );

  return (
    <div className="mini-chart-frame">
      <Pie data={chartData} options={options} />
    </div>
  );
}