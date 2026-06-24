import React from 'react';

export default function Analytics() {
  // Mock data representing future backend ML evaluation outputs
  const modelMetrics = [
    {
      name: "Isolation Forest (Baseline)",
      precision: 0.89,
      recall: 0.82,
      f1Score: 0.85,
      rocAuc: 0.91,
      status: "Production Candidate"
    },
    {
      name: "Autoencoder (Deep Learning)",
      precision: 0.94,
      recall: 0.88,
      f1Score: 0.91,
      rocAuc: 0.96,
      status: "Testing Phase"
    }
  ];

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="dashboard-title">Model Performance & Evaluation</h1>
        <p className="dashboard-subtitle">Comparative diagnostics of operational machine learning fraud engines</p>
      </header>

      {/* Metric Definitions Explainer Grid */}
      <section className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="kpi-card">
          <h3>Precision</h3>
          <p style={{ fontSize: '1.8rem', color: 'var(--cyan)' }}>PPV Engine</p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Of all flagged anomalies, how many were <strong>actually</strong> fraud? Minimizes false alarms.
          </span>
        </div>
        <div className="kpi-card">
          <h3>Recall</h3>
          <p style={{ fontSize: '1.8rem', color: 'var(--blue-light)' }}>Sensitivity</p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Of all real fraud out there, how many did we successfully catch? Minimizes leaked losses.
          </span>
        </div>
        <div className="kpi-card">
          <h3>F1-Score</h3>
          <p style={{ fontSize: '1.8rem', color: 'var(--green)' }}>Harmonic Mean</p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            The balanced benchmark weight combining Precision and Recall into a single quality matrix.
          </span>
        </div>
      </section>

      {/* Model Comparison Table Layout */}
      <main className="table-card" style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '4px' }}>Model Comparison Matrix</h2>
        <p className="dashboard-subtitle">Parallel comparison of Isolation Forest unsupervised limits vs Deep Autoencoder structural reconstruction weights.</p>

        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1 Score</th>
                <th>ROC AUC</th>
                <th>Deployment Status</th>
              </tr>
            </thead>
            <tbody>
              {modelMetrics.map((model, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{model.name}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--cyan)' }}>{(model.precision * 100).toFixed(1)}%</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--blue-light)' }}>{(model.recall * 100).toFixed(1)}%</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--green)' }}>{(model.f1Score * 100).toFixed(1)}%</td>
                  <td style={{ fontFamily: 'monospace' }}>{model.rocAuc.toFixed(2)}</td>
                  <td>
                    <span className={`risk-badge ${model.status === 'Production Candidate' ? 'low' : 'medium'}`}>
                      {model.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}