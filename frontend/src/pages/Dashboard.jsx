import Navbar from "../components/Navbar/Navbar";
import KPIcard from "../components/KPIcards/KPIcard";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import { dashboardStats, transactions } from "../mock/sampleData";
import FraudTrendChart from "../components/Charts/FraudTrendChart";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />

      <h1 className="dashboard-title">Fraud Monitoring Dashboard</h1>
      <p className="dashboard-subtitle">
        Real-time anomaly detection and transaction monitoring
      </p>

      <div className="kpi-grid">
        <KPIcard
          title="Total Transactions"
          value={dashboardStats.totalTransactions}
        />

        <KPIcard
          title="Fraud Transactions"
          value={dashboardStats.fraudTransactions}
        />

        <KPIcard
          title="Fraud Rate"
          value={dashboardStats.fraudRate}
        />

        <KPIcard
          title="Average Fraud Score"
          value={dashboardStats.averageFraudScore}
        />
      </div>
      <div className="chart-card">
        <div className="chart-header">
          <h2>Fraud Trend</h2>
          <p>Fraud alerts detected over time</p>
        </div>

        <FraudTrendChart />
      </div>
      <div className="table-card">
        <h2>Recent Transactions</h2>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}