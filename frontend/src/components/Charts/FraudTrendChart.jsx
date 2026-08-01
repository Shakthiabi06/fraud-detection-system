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

export default function FraudTrendChart({ transactions = [], range = "1M" }) {
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

  // Aggregate the same transaction stream into a range-appropriate series so
  // the dashboard tabs show distinct 1D / 1M / YTD views instead of a static
  // year-long monthly chart.
  const trendData = useMemo(() => {
    const seriesTransactions = transactions
      .map((txn) => {
        const timestamp = txn.timestamp ?? txn.created_at;
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return null;
        return { ...txn, date };
      })
      .filter(Boolean);

    if (seriesTransactions.length === 0) {
      return {
        labels: range === '1D' ? ['Now'] : range === 'YTD' ? ['Jan'] : ['Week 1'],
        fraudCounts: [0],
        totalCounts: [0],
      };
    }

    const maxDate = new Date(
      Math.max(...seriesTransactions.map((txn) => txn.date.getTime())),
    );

    if (range === '1D') {
      const labels = [];
      const fraudCounts = [];
      const totalCounts = [];
      const start = new Date(maxDate);
      start.setHours(maxDate.getHours() - 23, 0, 0, 0);

      for (let hour = 0; hour < 24; hour += 1) {
        const bucketStart = new Date(start);
        bucketStart.setHours(start.getHours() + hour);
        const bucketEnd = new Date(bucketStart);
        bucketEnd.setHours(bucketStart.getHours() + 1);

        labels.push(bucketStart.toLocaleTimeString([], { hour: 'numeric' }));
        fraudCounts.push(0);
        totalCounts.push(0);

        seriesTransactions.forEach((txn) => {
          if (txn.date >= bucketStart && txn.date < bucketEnd) {
            totalCounts[hour] += 1;
            if (txn.prediction === 'Fraud') {
              fraudCounts[hour] += 1;
            }
          }
        });
      }

      return { labels, fraudCounts, totalCounts };
    }

    if (range === '1M') {
      const labels = [];
      const fraudCounts = [];
      const totalCounts = [];
      const start = new Date(maxDate);
      start.setDate(maxDate.getDate() - 29);

      for (let day = 0; day < 30; day += 1) {
        const bucketStart = new Date(start);
        bucketStart.setDate(start.getDate() + day);
        bucketStart.setHours(0, 0, 0, 0);
        const bucketEnd = new Date(bucketStart);
        bucketEnd.setDate(bucketStart.getDate() + 1);

        labels.push(bucketStart.toLocaleDateString([], { month: 'short', day: 'numeric' }));
        fraudCounts.push(0);
        totalCounts.push(0);

        seriesTransactions.forEach((txn) => {
          if (txn.date >= bucketStart && txn.date < bucketEnd) {
            totalCounts[day] += 1;
            if (txn.prediction === 'Fraud') {
              fraudCounts[day] += 1;
            }
          }
        });
      }

      return { labels, fraudCounts, totalCounts };
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fraudCounts = Array(12).fill(0);
    const totalCounts = Array(12).fill(0);

    seriesTransactions.forEach((txn) => {
      const month = txn.date.getMonth();
      totalCounts[month] += 1;
      if (txn.prediction === 'Fraud') {
        fraudCounts[month] += 1;
      }
    });

    return {
      labels: months,
      fraudCounts,
      totalCounts,
    };
  }, [transactions, range]);

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