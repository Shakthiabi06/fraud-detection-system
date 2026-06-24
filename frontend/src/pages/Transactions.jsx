import { useMemo, useState } from "react";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import { dashboardStats, transactions } from "../mock/sampleData";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return transactions.filter((txn) => {
      const matchesRisk = riskFilter === "All" || txn.risk_level === riskFilter;
      const matchesSearch =
        !normalizedSearch ||
        [txn.transaction_id, txn.merchant, txn.country, txn.prediction, txn.risk_level]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesRisk && matchesSearch;
    });
  }, [riskFilter, searchTerm]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">Transaction ledger</p>
          <h1 className="dashboard-title">Review Queue</h1>
          <p className="dashboard-subtitle">
            Search, sort, and triage mock transactions before the backend contract is ready.
          </p>
        </div>
        <div className="run-status">
          <span className="status-dot" />
          <span className="tech-mono">{dashboardStats.totalTransactions} mock rows</span>
          <small>Frontend-only mode</small>
        </div>
      </header>

      <main className="table-card">
        <div className="table-toolbar">
          <div>
            <span className="panel-kicker">Controls</span>
            <h2>Transaction Explorer</h2>
          </div>
          <div className="toolbar-actions">
            <select
              className="filter-select"
              value={riskFilter}
              onChange={(event) => setRiskFilter(event.target.value)}
              aria-label="Filter by risk level"
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <label className="search-shell">
              <span>Search transactions</span>
              <input
                type="text"
                className="search-input"
                placeholder="ID, merchant, origin..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <kbd>Ctrl K</kbd>
            </label>
          </div>
        </div>
        <TransactionTable transactions={filteredTransactions} />
      </main>
    </div>
  );
}
