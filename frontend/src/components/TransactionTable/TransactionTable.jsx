import { useState } from "react";

export default function TransactionTable({ transactions }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transaction_id
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        className="search-input"
        type="text"
        placeholder="Search Transaction ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table border="1" className="transaction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Country</th>
            <th>Merchant</th>
            <th>Fraud Score</th>
            <th>Risk Level</th>
            <th>Prediction</th>
          </tr>
        </thead>

        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{transaction.transaction_id}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.country}</td>
              <td>{transaction.merchant}</td>
              <td>{transaction.fraud_score}</td>
              <td>
                <span className={`risk-badge ${transaction.risk_level.toLowerCase()}`}>
                  {transaction.risk_level}
                </span>
              </td>
              <td>{transaction.prediction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}