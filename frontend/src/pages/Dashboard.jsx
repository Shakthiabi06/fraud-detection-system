import Navbar from "../components/Navbar/Navbar";
import KPIcard from "../components/KPIcards/KPIcard";

export default function Dashboard() {
  return (
    <div>
      <Navbar />

      <h1>Dashboard</h1>

      <KPIcard
        title="Total Transactions"
        value="1000"
      />
    </div>
  );
}