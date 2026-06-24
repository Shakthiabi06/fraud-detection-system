import React, { useState } from 'react';
import { transactions, dashboardStats } from '../mock/sampleData';

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering transactions based on search token (ID, Country, or Merchant)
  const filteredTransactions = transactions.filter(txn =>
    txn.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Top Header Panel */}
      <header style={{ marginBottom: '32px' }}>
        <h1 className="dashboard-title">Fraud Risk Command</h1>
        <p className="dashboard-subtitle">Real-time ML scoring & financial security diagnostics</p>
      </header>

      {/* KPI Cards Grid */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <h3>Total Analyzed</h3>
          <p>{dashboardStats.totalTransactions}</p>
        </div>
        <div className="kpi-card">
          <h3>Identified Fraud</h3>
          <p style={{ color: 'var(--red)' }}>{dashboardStats.fraudTransactions}</p>
        </div>
        <div className="kpi-card">
          <h3>System Fraud Rate</h3>
          <p style={{ color: 'var(--cyan)' }}>{dashboardStats.fraudRate}</p>
        </div>
        <div className="kpi-card">
          <h3>Avg Risk Score</h3>
          <p style={{ color: 'var(--blue-light)' }}>{dashboardStats.averageFraudScore}</p>
        </div>
      </section>

      {/* Main Content Layout Grid */}
      <main className="table-card">
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '4px' }}>Transaction Ledger</h2>
            <p className="dashboard-subtitle" style={{ margin: 0 }}>Reviewing anomalous behavior & payload risk rankings</p>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search ID, merchant, country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dynamic Transaction Table Component */}
        <div style={{ overflowX: 'auto' }}>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Timestamp</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Country</th>
                <th>Fraud Score</th>
                <th>Risk Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn.transaction_id}>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{txn.transaction_id}</td>
                    <td>{new Date(txn.timestamp).toLocaleString()}</td>
                    <td>{txn.merchant}</td>
                    <td style={{ fontWeight: '600' }}>${txn.amount.toLocaleString()}</td>
                    <td>{txn.country}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                      {txn.fraud_score.toFixed(2)}
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No matching transactions discovered.
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