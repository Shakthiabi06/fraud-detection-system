import { useMemo } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function RiskDistributionChart({ transactions = [] }) {
  const colors = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    const green = styles.getPropertyValue("--green").trim();
    const blue = styles.getPropertyValue("--blue").trim();
    const amber = styles.getPropertyValue("--amber").trim();
    const red = styles.getPropertyValue("--red").trim();

    return {
      barColors: [
        `color-mix(in srgb, ${green} 50%, transparent)`,
        `color-mix(in srgb, ${blue} 50%, transparent)`,
        `color-mix(in srgb, ${amber} 56%, transparent)`,
        `color-mix(in srgb, ${red} 58%, transparent)`,
      ],
      textMuted: styles.getPropertyValue("--text-muted").trim(),
    };
  }, []);

  // Calculate risk distribution from real transactions
  const riskData = useMemo(() => {
    const levels = ['Low', 'Medium', 'High', 'Critical'];
    const counts = levels.map(level => {
      return transactions.filter(txn => txn.risk_level === level).length;
    });
    return { labels: levels, data: counts };
  }, [transactions]);

  const data = useMemo(
    () => ({
      labels: riskData.labels,
      datasets: [
        {
          label: "Transactions",
          data: riskData.data,
          backgroundColor: colors.barColors,
          borderRadius: 5,
          barPercentage: 0.62,
        },
      ],
    }),
    [colors, riskData],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          backgroundColor: "rgba(11, 16, 32, 0.94)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          borderWidth: 1,
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: colors.textMuted },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255, 255, 255, 0.045)" },
          ticks: { color: colors.textMuted, precision: 0 },
        },
      },
    }),
    [colors],
  );

  return (
    <div className="mini-chart-frame">
      <Bar data={data} options={options} />
    </div>
  );
}