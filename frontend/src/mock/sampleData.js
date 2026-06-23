export const transactions = [
  {
    transaction_id: "TXN001",
    amount: 1200,
    country: "IN",
    merchant: "Amazon IN",
    fraud_score: 0.87,
    prediction: "Fraud",
    timestamp: "2026-06-23T10:30:00"
  },
  {
    transaction_id: "TXN002",
    amount: 450,
    country: "US",
    merchant: "Walmart",
    fraud_score: 0.12,
    prediction: "Legit",
    timestamp: "2026-06-23T11:00:00"
  }
];

export const dashboardStats = {
  totalTransactions: transactions.length,
  fraudTransactions: transactions.filter(
    txn => txn.prediction === "Fraud"
  ).length,
  fraudRate: (
    transactions.filter(
      txn => txn.prediction === "Fraud"
    ).length /
    transactions.length *
    100
  ).toFixed(1) + "%",
  averageFraudScore:
    (
      transactions.reduce(
        (sum, txn) => sum + txn.fraud_score,
        0
      ) / transactions.length
    ).toFixed(2)
};