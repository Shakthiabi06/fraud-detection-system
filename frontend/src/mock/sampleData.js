export const transactions = [
  {
    transaction_id: "TXN-884210",
    amount: 12940,
    country: "IN",
    merchant: "Amazon Marketplace India Private Limited",
    fraud_score: 0.87,
    prediction: "Fraud",
    risk_level: "Critical",
    timestamp: "2026-06-23T10:30:00",
  },
  {
    transaction_id: "TXN-884211",
    amount: 450,
    country: "US",
    merchant: "Walmart",
    fraud_score: 0.12,
    prediction: "Legitimate",
    risk_level: "Low",
    timestamp: "2026-06-23T11:00:00",
  },
  {
    transaction_id: "TXN-884212",
    amount: 9820,
    country: "NG",
    merchant: "OrbitPay Cross Border Settlement",
    fraud_score: 0.76,
    prediction: "Review",
    risk_level: "High",
    timestamp: "2026-06-23T11:16:00",
  },
  {
    transaction_id: "TXN-884213",
    amount: 78,
    country: "GB",
    merchant: "Pret A Manger",
    fraud_score: 0.08,
    prediction: "Legitimate",
    risk_level: "Low",
    timestamp: "2026-06-23T11:22:00",
  },
  {
    transaction_id: "TXN-884214",
    amount: 2040,
    country: "AE",
    merchant: "Emirates Digital Services",
    fraud_score: 0.42,
    prediction: "Monitor",
    risk_level: "Medium",
    timestamp: "2026-06-23T11:37:00",
  },
  {
    transaction_id: "TXN-884215",
    amount: 38900,
    country: "BR",
    merchant: "Sao Paulo Luxury Exchange",
    fraud_score: 0.93,
    prediction: "Fraud",
    risk_level: "Critical",
    timestamp: "2026-06-23T12:05:00",
  },
  {
    transaction_id: "TXN-884216",
    amount: 1260,
    country: "DE",
    merchant: "Klarna Retail GmbH",
    fraud_score: 0.31,
    prediction: "Monitor",
    risk_level: "Medium",
    timestamp: "2026-06-23T12:19:00",
  },
  {
    transaction_id: "TXN-884217",
    amount: 714,
    country: "CA",
    merchant: "Shopify Merchant Services",
    fraud_score: 0.18,
    prediction: "Legitimate",
    risk_level: "Low",
    timestamp: "2026-06-23T12:48:00",
  },
  {
    transaction_id: "TXN-884218",
    amount: 6830,
    country: "TH",
    merchant: "Bangkok Air Travel Desk",
    fraud_score: 0.69,
    prediction: "Review",
    risk_level: "High",
    timestamp: "2026-06-23T13:10:00",
  },
  {
    transaction_id: "TXN-884219",
    amount: 226,
    country: "SG",
    merchant: "Grab Holdings",
    fraud_score: 0.14,
    prediction: "Legitimate",
    risk_level: "Low",
    timestamp: "2026-06-23T13:41:00",
  },
  {
    transaction_id: "TXN-884220",
    amount: 17750,
    country: "TR",
    merchant: "Istanbul FX Desk",
    fraud_score: 0.81,
    prediction: "Fraud",
    risk_level: "Critical",
    timestamp: "2026-06-23T14:03:00",
  },
  {
    transaction_id: "TXN-884221",
    amount: 3100,
    country: "MX",
    merchant: "Mercado Pago",
    fraud_score: 0.37,
    prediction: "Monitor",
    risk_level: "Medium",
    timestamp: "2026-06-23T14:25:00",
  },
];

const flaggedTransactions = transactions.filter(
  (txn) => txn.prediction === "Fraud" || txn.prediction === "Review",
);

const fraudOnlyTransactions = transactions.filter((txn) => txn.prediction === "Fraud");
const blockedTransactions = transactions.filter(
  (txn) => txn.prediction === "Fraud" && txn.risk_level === "Critical",
);
const leakageTransactions = transactions.filter(
  (txn) => txn.prediction === "Review" || txn.prediction === "Monitor",
);

const sumAmount = (rows) => rows.reduce((sum, txn) => sum + txn.amount, 0);

const formatMoney = (value) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value}`;
};

// Risk level counts, derived from the actual transaction list instead of
// being hand-typed, so the dashboard panel can never drift out of sync
// with the table data.
export const riskLevelCounts = transactions.reduce((acc, txn) => {
  acc[txn.risk_level] = (acc[txn.risk_level] || 0) + 1;
  return acc;
}, {});

export const dashboardStats = {
  totalTransactions: transactions.length,
  fraudTransactions: flaggedTransactions.length,
  fraudRate: `${((flaggedTransactions.length / transactions.length) * 100).toFixed(1)}%`,
  averageFraudScore: (
    transactions.reduce((sum, txn) => sum + txn.fraud_score, 0) / transactions.length
  ).toFixed(2),
  exposure: formatMoney(sumAmount(fraudOnlyTransactions)),
  capitalAtRisk: formatMoney(sumAmount(flaggedTransactions)),
  blocked: formatMoney(sumAmount(blockedTransactions)),
  leakage: formatMoney(sumAmount(leakageTransactions)),
  queueLatency: "1m 42s",
};

export const analyticsData = {
  monthlyTrends: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    fraudCounts: [4, 9, 6, 12, 8, 15, 11, 17],
    legitimateCounts: [120, 145, 132, 168, 150, 185, 174, 206],
  },
  countryDistribution: {
    labels: ["US", "IN", "GB", "BR", "DE"],
    datasets: [12, 19, 6, 8, 5],
  },
  riskDistribution: {
    labels: ["Low", "Medium", "High", "Critical"],
    datasets: [4, 3, 2, 3],
  },
};

export const modelMetrics = [
  {
    name: "Isolation Forest",
    accuracy: 0.91,
    precision: 0.89,
    recall: 0.82,
    f1Score: 0.85,
    rocAuc: 0.91,
    status: "Baseline",
  },
  {
    name: "Autoencoder",
    accuracy: 0.94,
    precision: 0.94,
    recall: 0.88,
    f1Score: 0.91,
    rocAuc: 0.96,
    status: "Candidate",
  },
];