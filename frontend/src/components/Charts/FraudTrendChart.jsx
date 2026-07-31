import { useMemo } from 'react';
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

export default function FraudTrendChart({ transactions = [] }) {
  const colors = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      cyan: styles.getPropertyValue('--cyan').trim(),
      blue: styles.getPropertyValue('--blue').trim(),
      bgMain: styles.getPropertyValue('--bg-main').trim(),
      textSecondary: styles.getPropertyValue('--text-secondary').trim(),
      textMuted: styles.getPropertyValue('--text-muted').trim(),
      textPrimary: styles.getPropertyValue('--text-primary').trim(),
    };
  }, []);

  // Calculate monthly trends from real transactions
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fraudCounts = Array(12).fill(0);
    const totalCounts = Array(12).fill(0);
    
    transactions.forEach(txn => {
      const date = new Date(txn.timestamp);
      const month = date.getMonth();
      totalCounts[month]++;
      if (txn.prediction === 'Fraud') {
        fraudCounts[month]++;
      }
    });
    
    return {
      labels: months,
      fraudCounts,
      totalCounts,
    };
  }, [transactions]);

  const data = useMemo(
    () => ({
      labels: trendData.labels,
      datasets: [
        {
          type: 'line',
          label: 'Fraud Incidents',
          data: trendData.fraudCounts,
          borderColor: colors.cyan,
          backgroundColor: 'rgba(34, 199, 217, 0.08)',
          pointBackgroundColor: colors.bgMain,
          pointBorderColor: colors.cyan,
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.22,
          fill: true,
          yAxisID: 'y'
        },
        {
          type: 'bar',
          label: 'Total Volume',
          data: trendData.totalCounts,
          backgroundColor: 'rgba(59, 130, 246, 0.18)',
          borderRadius: 5,
          barPercentage: 0.62,
          categoryPercentage: 0.72,
          yAxisID: 'y1'
        }
      ]
    }),
    [colors, trendData]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          align: 'end',
          position: 'top',
          labels: {
            boxHeight: 8,
            boxWidth: 8,
            color: colors.textSecondary,
            font: { family: 'Inter', size: 11 },
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(11, 16, 32, 0.94)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          displayColors: false,
          padding: 10,
          titleColor: colors.textPrimary,
          bodyColor: colors.textSecondary
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.035)', drawTicks: false },
          ticks: { color: colors.textMuted }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.045)' },
          ticks: { color: colors.cyan }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: colors.blue }
        }
      }
    }),
    [colors]
  );

  return (
    <div className="chart-frame">
      <Chart type='bar' data={data} options={options} />
    </div>
  );
}