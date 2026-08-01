import { useState } from "react";
import {
  dashboardStats as mockDashboardStats,
  riskLevelCounts,
  transactions as mockTransactions,
} from "../mock/sampleData";
import { getFraudSummary, getTransactions } from "../services/api";
import { useFetchData } from "../hooks/useFetchData";
import FraudByCountryChart from "../components/Charts/FraudByCountryChart";
import FraudTrendChart from "../components/Charts/FraudTrendChart";
import RiskDistributionChart from "../components/Charts/RiskDistributionChart";
import KPIcard from "../components/KPIcards/KPIcard";
import TransactionTable from "../components/TransactionTable/TransactionTable";

// tone mapping only — counts are derived from riskLevelCounts (mock) below;
// once live transactions are flowing this would need to be recomputed from
// the live transaction list the same way (see riskLevelCounts in
// sampleData.js for the reduce() pattern to copy).
const riskToneMap = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "low",
};

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [chartRange, setChartRange] = useState("YTD");

  // In mock mode (USE_LIVE_API=false), these behave exactly as before —
  // transactions/dashboardStats come straight from sampleData.js with no
  // network call. In live mode, they start as the mock values and update
  // once the real backend responds. See src/hooks/useFetchData.js.
  const { data: transactions, loading: transactionsLoading } = useFetchData(
    mockTransactions,
    getTransactions,
  );

  console.log("🔴 TRANSACTIONS LENGTH:", transactions.length);
  console.log("🔴 FIRST TRANSACTION:", transactions[0]);
  const { data: dashboardStats, loading: statsLoading } = useFetchData(
    mockDashboardStats,
    getFraudSummary,
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredTransactions = transactions.filter((txn) => {
    if (!normalizedSearch) return true;

    return [txn.transaction_id, txn.merchant, txn.country, txn.prediction, txn.risk_level]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  // riskLevelCounts (mock-derived) is used directly for now since the live
  // /fraud-summary endpoint doesn't return a per-risk-level breakdown yet.
  // If/when it does, swap this for a count derived from `transactions`.
  // Calculate risk bands from REAL transactions
  const riskSegments = (() => {
    // Count transactions by risk level from real data
    const counts = transactions.reduce((acc, txn) => {
      const level = txn.risk_level || 'Low';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(riskToneMap).map(([label, tone]) => ({
      label,
      value: String(counts[label] || 0),
      tone,
    }));
  })();

  // The 3 highest fraud-score transactions, used to fill the space below the
  // risk bands. Derived from whichever transaction list is currently active
  // (mock or live).
  const topFlaggedTransactions = [...transactions]
    .sort((a, b) => b.fraud_score - a.fraud_score)
    .slice(0, 3);

  const kpiCards = [
    {
      key: "exposure",
      title: "Flagged exposure",
      value: dashboardStats.exposure || "$0K",
      subtitle: `Across ${dashboardStats.fraudTransactions || 0} active anomalies`,
      variant: "primary",
    },
    {
      key: "fraudRate",
      title: "Detection rate",
      value: dashboardStats.fraudRate || "0%",
      subtitle: "Review + confirmed fraud",
      variant: "compact",
    },
    {
      key: "avgScore",
      title: "Mean risk weight",
      value: dashboardStats.averageFraudScore || "0.00",
      subtitle: "Rolling 24h sample",
      variant: "compact-offset",
    },
    {
      key: "latency",
      title: "Queue latency",
      value: dashboardStats.queueLatency || "< 1s",
      subtitle: "Case creation median",
      variant: "latency",
    },
  ];

  console.log("🔴 DASHBOARD STATS:", dashboardStats);
  console.log("🔴 TRANSACTIONS:", transactions);

  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">Risk operations</p>
          <h1 className="dashboard-title">Fraud Risk Command</h1>
          <p className="dashboard-subtitle">
            Real-time transaction screening, anomaly triage, and model telemetry across
            payment corridors.
          </p>
        </div>
        <div className="run-status">
          <span className={`status-dot ${statsLoading || transactionsLoading ? 'syncing' : 'healthy'}`} />
          <span className="tech-mono">
            {statsLoading || transactionsLoading ? "Syncing..." : "Stream healthy"}
          </span>
          <small>Updated: {new Date().toLocaleTimeString()}</small>
        </div>
      </header>

      <section className="kpi-grid" aria-label="Fraud operations summary">
        {kpiCards.map((card) => (
          <KPIcard
            key={card.key}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            variant={card.variant}
          />
        ))}
      </section>

      <section className="dashboard-grid">
        <section className="chart-card">
          <div className="panel-header sticky-panel-header">
            <div>
              <span className="panel-kicker">Model signal</span>
              <h2>Volume vs confirmed fraud</h2>
            </div>
            <div className="segmented-control" aria-label="Chart range">
              <button
                type="button"
                className={chartRange === "1D" ? "active" : ""}
                onClick={() => setChartRange("1D")}
              >
                1D
              </button>
              <button
                className={chartRange === "1M" ? "active" : ""}
                type="button"
                onClick={() => setChartRange("1M")}
              >
                1M
              </button>
              <button
                type="button"
                className={chartRange === "YTD" ? "active" : ""}
                onClick={() => setChartRange("YTD")}
              >
                YTD
              </button>
            </div>
          </div>
          <FraudTrendChart transactions={transactions} range={chartRange} />
          <div className="metric-strip">
            <div>
              <span>Capital at risk</span>
              <strong>
                {transactions.length > 0 
                  ? `$${(transactions.reduce((sum, t) => sum + (t.prediction === 'Fraud' ? t.amount : 0), 0) / 1000).toFixed(1)}K`
                  : "$0K"
                }
              </strong>
            </div>
            <div>
              <span>Blocked</span>
              <strong>
                {transactions.length > 0 
                  ? `${(transactions.filter(t => t.risk_level === 'Critical').length / transactions.length * 100).toFixed(1)}%`
                  : "0%"
                }
              </strong>
            </div>
            <div>
              <span>Leakage est.</span>
              <strong>
                {transactions.length > 0 
                  ? `${(transactions.filter(t => t.risk_level === 'High' || t.risk_level === 'Medium').length / transactions.length * 100).toFixed(1)}%`
                  : "0%"
                }
              </strong>
            </div>
          </div>
        </section>

        <aside className="risk-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Queue</span>
              <h2>Risk bands</h2>
            </div>
            <span className="tech-mono muted-text">
              {dashboardStats.totalTransactions ?? 0} txns
            </span>
          </div>
          <div className="risk-list">
            {riskSegments.map((segment) => (
              <button className="risk-row" type="button" key={segment.label}>
                <span className={`risk-marker ${segment.tone}`} />
                <span>{segment.label}</span>
                <strong className="tech-mono">{segment.value}</strong>
              </button>
            ))}
          </div>

          <div className="top-flagged">
            <span className="panel-kicker top-flagged-kicker">Top flagged</span>
            <div className="top-flagged-list">
              {topFlaggedTransactions.map((txn) => (
                <button
                  className="top-flagged-row"
                  type="button"
                  key={txn.transaction_id}
                  title={`${txn.merchant ?? "Unknown merchant"} — ${txn.prediction}`}
                >
                  <span className={`risk-marker ${riskToneMap[txn.risk_level] || "low"}`} />
                  <span className="tech-mono top-flagged-id">{txn.transaction_id}</span>
                  <strong className="tech-mono">{txn.fraud_score.toFixed(2)}</strong>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="insight-grid" aria-label="Fraud distribution charts">
        <article className="insight-card">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Geo exposure</span>
              <h2>Fraud by Country</h2>
            </div>
          </div>
          <div style={{ height: '220px' }}>
            <FraudByCountryChart transactions={transactions} />
          </div>
        </article>
        <article className="insight-card dense-insight">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Score bands</span>
              <h2>Risk Distribution</h2>
            </div>
          </div>
          <div style={{ height: '220px' }}>
            <RiskDistributionChart transactions={transactions} />
          </div>
        </article>
      </section>

      <main className="table-card">
        <div className="table-toolbar">
          <div>
            <span className="panel-kicker">Ledger</span>
            <h2>Transaction Review Queue</h2>
          </div>
          <label className="search-shell">
            <span>Search assets, transactions</span>
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
        <TransactionTable transactions={filteredTransactions} />
      </main>
    </div>
  );
}

export default Dashboard;
