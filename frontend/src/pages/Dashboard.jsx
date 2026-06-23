import Navbar from "../components/Navbar/Navbar";
import KPIcard from "../components/KPIcards/KPIcard";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import { dashboardStats, transactions } from "../mock/sampleData";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />

      <h1 className="dashboard-title">Dashboard</h1>

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

      <TransactionTable transactions={transactions} />
    </div>
  );
}