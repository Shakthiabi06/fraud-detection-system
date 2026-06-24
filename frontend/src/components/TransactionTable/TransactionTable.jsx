import { useMemo, useState } from "react";

const rowsPerPage = 8;

const columns = [
  { key: "transaction_id", label: "Transaction ID" },
  { key: "merchant", label: "Merchant" },
  { key: "country", label: "Origin" },
  { key: "amount", label: "Amount" },
  { key: "fraud_score", label: "Fraud Score" },
  { key: "prediction", label: "Prediction" },
  { key: "risk_level", label: "Risk Level" },
  { key: "timestamp", label: "Timestamp" },
];

const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;

  if (numericAmount >= 10000) {
    return `$${(numericAmount / 1000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function TransactionTable({ transactions = [] }) {
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }

      return sortConfig.direction === "asc"
        ? String(valA).localeCompare(String(valB), undefined, { numeric: true })
        : String(valB).localeCompare(String(valA), undefined, { numeric: true });
    });
  }, [transactions, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  const handleSort = (key) => {
    setSortConfig((currentSort) => ({
      key,
      direction:
        currentSort.key === key && currentSort.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ASC" : " DESC";
  };

  return (
    <div className="transaction-table-shell">
      <div className="transaction-table-wrap">
        <table className="transaction-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  aria-sort={
                    sortConfig.key === column.key
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button type="button" onClick={() => handleSort(column.key)}>
                    {column.label}
                    <span aria-hidden="true">{getSortIndicator(column.key)}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((txn) => (
                <tr key={txn.transaction_id}>
                  <td className="tech-mono" title={txn.transaction_id}>
                    {txn.transaction_id}
                  </td>
                  <td title={txn.merchant}>{txn.merchant}</td>
                  <td className="tech-mono" title={txn.country}>
                    {txn.country}
                  </td>
                  <td>{formatCurrency(txn.amount)}</td>
                  <td className="tech-mono">{Number(txn.fraud_score).toFixed(2)}</td>
                  <td title={txn.prediction}>{txn.prediction}</td>
                  <td>
                    <span className={`risk-badge ${String(txn.risk_level).toLowerCase()}`}>
                      {txn.risk_level}
                    </span>
                  </td>
                  <td className="tech-mono">{formatTimestamp(txn.timestamp)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty-table-state" colSpan={columns.length}>
                  No transactions match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-bar">
        <span className="tech-mono">
          Showing {paginatedTransactions.length ? startIndex + 1 : 0}-
          {Math.min(startIndex + rowsPerPage, sortedTransactions.length)} of{" "}
          {sortedTransactions.length}
        </span>
        <div>
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={safeCurrentPage === 1}
          >
            Previous
          </button>
          <span className="tech-mono">
            Page {safeCurrentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={safeCurrentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
