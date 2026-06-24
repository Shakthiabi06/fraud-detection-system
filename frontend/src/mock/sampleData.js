export const transactions = [
  {
    transaction_id: "TXN001",
    amount: 1200,
    country: "IN",
    merchant: "Amazon IN",
    fraud_score: 0.87,
    prediction: "Fraud",
    risk_level: "Critical",
    timestamp: "2026-06-23T10:30:00"
  },
  {
    transaction_id: "TXN002",
    amount: 450,
    country: "US",
    merchant: "Walmart",
    fraud_score: 0.12,
    prediction: "Legitimate",
    risk_level: "Low",
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

export const analyticsData = {
  monthlyTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    fraudCounts: [4, 7, 2, 9, 5, 8],
    legitimateCounts: [120, 145, 132, 168, 150, 185]
  },
  countryDistribution: {
    labels: ['US', 'IN', 'UK', 'CA', 'DE'],
    datasets: [12, 19, 3, 5, 2]
  }
};