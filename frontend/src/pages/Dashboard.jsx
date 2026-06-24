import React, { useState } from 'react';
import { transactions, dashboardStats } from '../mock/sampleData';
import FraudTrendChart from '../components/Charts/FraudTrendChart';
import TransactionTable from "../components/TransactionTable/TransactionTable"; 

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(txn =>
    txn.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header>
        <div>
          <h1 className="dashboard-title">Fraud Risk Command</h1>
          <p className="dashboard-subtitle">
            Real-time telemetry stream and pipeline security diagnostics
          </p>
        </div>
        <div className="tech-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ENV: DEVELOPMENT_CONTRACT_MODE
        </div>
      </header>

      {/* KPIs */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <h3>Total Volume</h3>
          <p className="tech-mono">{dashboardStats.totalTransactions}</p>
        </div>
        <div className="kpi-card">
          <h3>Flagged Anomalies</h3>
          <p className="tech-mono" style={{ color: 'var(--red)' }}>{dashboardStats.fraudTransactions}</p>
        </div>
        <div className="kpi-card">
          <h3>Detection Rate</h3>
          <p className="tech-mono" style={{ color: 'var(--cyan)' }}>{dashboardStats.fraudRate}</p>
        </div>
        <div className="kpi-card">
          <h3>Mean Risk Weight</h3>
          <p className="tech-mono" style={{ color: 'var(--blue)' }}>{dashboardStats.averageFraudScore}</p>
        </div>
      </section>

      {/* Chart */}
      <section className="chart-card">
        <h2>System Risk Vectors & Volume Trends</h2>
        <FraudTrendChart />
      </section>

      {/* Transactions */}
      <main className="table-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <h2>Transaction Ledger</h2>
          <input
            type="text"
            className="search-input tech-mono"
            placeholder="FILTER BY ID, MERCHANT, ORIGIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TransactionTable transactions={filteredTransactions} />
      </main>
    </div>
  );
}

export default Dashboard