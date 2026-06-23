import Navbar from "../components/Navbar/Navbar";
import KPIcard from "../components/KPIcards/KPIcard";
import { dashboardStats } from "../mock/sampleData";

export default function Dashboard() {
  return (
    <div>
      <Navbar />

      <h1>Dashboard</h1>

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
  );
}