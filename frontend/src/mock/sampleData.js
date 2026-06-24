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

// Illustrative confusion matrix for the candidate model (Autoencoder).
// This is NOT counted from the 12 mock transactions above — there aren't
// enough rows to produce a readable matrix, and they have no ground-truth
// "actually fraud" label separate from the model's own prediction. Instead,
// these counts are scaled to a round total (200) and solved so they
// reproduce the Autoencoder's *stated* precision (0.94) and recall (0.88)
// almost exactly. Treat this as a teaching illustration of what those
// percentages mean in concrete counts, not as a measurement.
// Fixed score population for the interactive threshold slider on the
// Analytics page. These are NOT real model outputs — they're a generated,
// reproducible set of "fraud likelihood" scores (0-1) for 50 simulated
// fraud cases and 150 simulated legitimate cases, built so that at a
// threshold of ~0.58 the resulting precision/recall land almost exactly on
// the Autoencoder's stated metrics (94% precision, 88% recall) elsewhere on
// this page. Moving the threshold slider recomputes TP/FP/FN/TN live by
// counting how many scores in each group fall above/below that line —
// this lets you feel the precision/recall tradeoff instead of just reading
// two static numbers. Fixed (not randomly regenerated) so the demo behaves
// the same every time you reload the page.
export const fraudLikelihoodScores = {
  fraudCases: [0.754, 0.749, 0.76, 0.906, 0.757, 0.51, 0.84, 0.732, 0.741, 0.801, 0.822, 0.989, 0.898, 0.8, 0.647, 0.597, 0.824, 0.999, 0.787, 0.761, 0.876, 0.518, 0.724, 0.868, 0.937, 0.737, 0.848, 0.825, 0.921, 0.58, 0.882, 0.507, 0.308, 0.671, 0.615, 0.938, 0.9, 0.561, 0.933, 0.6, 0.764, 0.727, 0.801, 0.927, 0.895, 0.843, 0.897, 0.866, 0.667, 0.651],
  legitimateCases: [0.145, 0.3, 0.18, 0.594, 0.089, 0.044, 0.343, 0.447, 0.301, 0.354, 0.448, 0.205, 0.001, 0.135, 0.372, 0.001, 0.225, 0.261, 0.17, 0.336, 0.313, 0.591, 0.319, 0.122, 0.13, 0.087, 0.372, 0.129, 0.209, 0.34, 0.104, 0.173, 0.001, 0.047, 0.129, 0.287, 0.411, 0.217, 0.262, 0.247, 0.394, 0.363, 0.264, 0.058, 0.365, 0.281, 0.416, 0.215, 0.532, 0.163, 0.475, 0.238, 0.137, 0.039, 0.196, 0.448, 0.351, 0.33, 0.001, 0.334, 0.309, 0.132, 0.12, 0.22, 0.496, 0.051, 0.152, 0.438, 0.149, 0.162, 0.236, 0.021, 0.255, 0.026, 0.362, 0.221, 0.585, 0.265, 0.439, 0.011, 0.2, 0.272, 0.499, 0.001, 0.378, 0.315, 0.465, 0.334, 0.228, 0.137, 0.02, 0.251, 0.189, 0.543, 0.122, 0.271, 0.001, 0.157, 0.262, 0.352, 0.452, 0.213, 0.041, 0.293, 0.303, 0.299, 0.108, 0.401, 0.234, 0.332, 0.424, 0.317, 0.266, 0.564, 0.259, 0.173, 0.238, 0.457, 0.239, 0.303, 0.411, 0.138, 0.001, 0.268, 0.257, 0.123, 0.359, 0.317, 0.061, 0.303, 0.189, 0.001, 0.292, 0.213, 0.101, 0.304, 0.298, 0.128, 0.284, 0.382, 0.106, 0.281, 0.22, 0.583, 0.001, 0.331, 0.171, 0.204, 0.524, 0.219],
  defaultThreshold: 0.58,
};

export const candidateConfusionMatrix = {
  truePositive: 44,
  falseNegative: 6,
  falsePositive: 3,
  trueNegative: 147,
  total: 200,
  isIllustrative: true,
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