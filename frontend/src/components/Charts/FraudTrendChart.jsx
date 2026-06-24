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
import { analyticsData } from '../../mock/sampleData';

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
  // Read CSS variables once and memoize. Previously this ran on every
  // render via getComputedStyle(document.documentElement), which is
  // wasteful, and getPropertyValue() returns strings with a leading
  // space (e.g. " #22c7d9") that we now trim to avoid subtle rendering
  // issues if these values get used anywhere stricter than Chart.js.
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

  const data = useMemo(
    () => ({
      labels: analyticsData.monthlyTrends.labels,
      datasets: [
        {
          type: 'line',
          label: 'Fraud Incidents',
          data: analyticsData.monthlyTrends.fraudCounts,
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
          data: analyticsData.monthlyTrends.legitimateCounts,
          backgroundColor: 'rgba(59, 130, 246, 0.18)',
          borderRadius: 5,
          barPercentage: 0.62,
          categoryPercentage: 0.72,
          yAxisID: 'y1'
        }
      ]
    }),
    [colors]
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
