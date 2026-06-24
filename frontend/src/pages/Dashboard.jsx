import { useState } from "react";
import { dashboardStats, riskLevelCounts, transactions } from "../mock/sampleData";
import FraudByCountryChart from "../components/Charts/FraudByCountryChart";
import FraudTrendChart from "../components/Charts/FraudTrendChart";
import RiskDistributionChart from "../components/Charts/RiskDistributionChart";
import KPIcard from "../components/KPIcards/KPIcard";
import TransactionTable from "../components/TransactionTable/TransactionTable";

// tone mapping only — counts now come from riskLevelCounts (sampleData.js),
// derived from the real transaction list instead of being hand-typed here.
const riskToneMap = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "low",
};

const riskSegments = Object.entries(riskToneMap).map(([label, tone]) => ({
  label,
  value: String(riskLevelCounts[label] || 0),
  tone,
}));

// The 3 highest fraud-score transactions, used to fill the space below the
// risk bands. This replaces a static decorative "skeleton-block" that was
// never wired to real data — it just animated forever and looked like a
// stuck loading state. This list is genuinely derived from `transactions`
// and updates if the mock data (or eventually real data) changes.
const topFlaggedTransactions = [...transactions]
  .sort((a, b) => b.fraud_score - a.fraud_score)
  .slice(0, 3);

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredTransactions = transactions.filter((txn) => {
    if (!normalizedSearch) return true;

    return [txn.transaction_id, txn.merchant, txn.country, txn.prediction, txn.risk_level]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  // Built from dashboardStats so each card's content lives in one place.
  // Previously these four cards were written out by hand directly in JSX
  // (each its own <article className="kpi-card ...">), duplicating markup
  // that KPIcard.jsx already existed to provide but wasn't being used.
  const kpiCards = [
    {
      key: "exposure",
      title: "Flagged exposure",
      value: dashboardStats.exposure,
      subtitle: `Across ${dashboardStats.fraudTransactions} active anomalies`,
      variant: "primary",
    },
    {
      key: "fraudRate",
      title: "Detection rate",
      value: dashboardStats.fraudRate,
      subtitle: "Review + confirmed fraud",
      variant: "compact",
    },
    {
      key: "avgScore",
      title: "Mean risk weight",
      value: dashboardStats.averageFraudScore,
      subtitle: "Rolling 24h sample",
      variant: "compact-offset",
    },
    {
      key: "latency",
      title: "Queue latency",
      value: dashboardStats.queueLatency,
      subtitle: "Case creation median",
      variant: "latency",
    },
  ];

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
          <span className="status-dot" />
          <span className="tech-mono">Stream healthy</span>
          <small>Last sync 24s ago</small>
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
              <button type="button">1D</button>
              <button className="active" type="button">
                1M
              </button>
              <button type="button">YTD</button>
            </div>
          </div>
          <FraudTrendChart />
          <div className="metric-strip">
            <div>
              <span>Capital at risk</span>
              <strong>{dashboardStats.capitalAtRisk}</strong>
            </div>
            <div>
              <span>Blocked</span>
              <strong>{dashboardStats.blocked}</strong>
            </div>
            <div>
              <span>Leakage est.</span>
              <strong>{dashboardStats.leakage}</strong>
            </div>
          </div>
        </section>

        <aside className="risk-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Queue</span>
              <h2>Risk bands</h2>
            </div>
            <span className="tech-mono muted-text">{dashboardStats.totalTransactions} txns</span>
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
                  title={`${txn.merchant} — ${txn.prediction}`}
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
          <FraudByCountryChart />
        </article>
        <article className="insight-card dense-insight">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Score bands</span>
              <h2>Risk Distribution</h2>
            </div>
          </div>
          <RiskDistributionChart />
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
