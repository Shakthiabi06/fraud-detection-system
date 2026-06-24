import React, { useState } from "react";

export default function TransactionTable({ transactions }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Sorting logic
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("transaction_id")}>ID</th>
            <th onClick={() => handleSort("timestamp")}>Timestamp</th>
            <th onClick={() => handleSort("merchant")}>Merchant</th>
            <th onClick={() => handleSort("amount")}>Amount</th>
            <th onClick={() => handleSort("country")}>Country</th>
            <th onClick={() => handleSort("fraud_score")}>Fraud Score</th>
            <th>Risk Level</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((txn) => (
              <tr key={txn.transaction_id}>
                <td>{txn.transaction_id}</td>
                <td>{new Date(txn.timestamp).toLocaleString()}</td>
                <td>{txn.merchant}</td>
                <td>${txn.amount.toFixed(2)}</td>
                <td>{txn.country}</td>
                <td style={{ color: txn.fraud_score > 0.5 ? 'var(--red)' : 'var(--text-primary)' }}>
                  {txn.fraud_score.toFixed(4)}
                </td>
                <td>
                  <span className={`risk-badge ${txn.risk_level.toLowerCase()}`}>
                    {txn.risk_level}
                  </span>
                </td>
                <td>{txn.prediction}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                NO VECTOR MATCHES FOUND IN ACTIVE BUFFER MEMORY.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={{ marginTop: "12px", display: "flex", justifyContent: "center", gap: "8px" }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Prev
        </button>
        <span className="tech-mono">Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
