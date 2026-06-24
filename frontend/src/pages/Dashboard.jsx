import React, { useState } from 'react';
import { transactions, dashboardStats } from '../mock/sampleData';
import FraudTrendChart from '../components/Charts/FraudTrendChart';

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(txn =>
    txn.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="dashboard-title">Fraud Risk Command</h1>
          <p className="dashboard-subtitle">Real-time telemetry stream and pipeline security diagnostics</p>
        </div>
        <div className="tech-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ENV: DEVELOPMENT_CONTRACT_MODE
        </div>
      </header>

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
          <p className="tech-mono" style={{ color: 'var(--blue-light)' }}>{dashboardStats.averageFraudScore}</p>
        </div>
      </section>

      <section className="chart-card">
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>System Risk Vectors & Volume Trends</h2>
        </div>
        <FraudTrendChart />
      </section>

      <main className="table-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Transaction Ledger</h2>
          </div>
          <input
            type="text"
            className="search-input tech-mono"
            placeholder="FILTER BY ID, MERCHANT, ORIGIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Timestamp</th>
                <th>Merchant Target</th>
                <th>Amount</th>
                <th>Origin</th>
                <th>Anomalous Weight</th>
                <th>Security Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn.transaction_id}>
                    <td className="tech-mono" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{txn.transaction_id}</td>
                    <td className="tech-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(txn.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                    </td>
                    <td>{txn.merchant}</td>
                    <td className="tech-mono" style={{ fontWeight: '600' }}>${txn.amount.toFixed(2)}</td>
                    <td className="tech-mono">{txn.country}</td>
                    <td className="tech-mono" style={{ fontWeight: '600', color: txn.fraud_score > 0.5 ? 'var(--red)' : 'var(--text-primary)' }}>
                      {txn.fraud_score.toFixed(4)}
                    </td>
                    <td>
                      <span className={`risk-badge ${txn.risk_level.toLowerCase()}`}>
                        {txn.risk_level}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="tech-mono" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    NO VECTOR MATCHES FOUND IN ACTIVE BUFFER MEMORY.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;