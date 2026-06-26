import { useMemo, useState } from "react";
import { transactions } from "../../mock/sampleData";
import { runIsolationForest } from "../../utils/isolationForest";

// Extracts the two real numeric features used to run the forest:
// transaction amount, and time-of-day (hours, as a decimal) parsed from
// each transaction's actual timestamp. No invented/fake features — these
// are genuinely derived from the data already in sampleData.js.
function extractFeatures(txns) {
  return txns.map((txn) => {
    const date = new Date(txn.timestamp);
    const hourOfDay = date.getHours() + date.getMinutes() / 60;
    return [txn.amount, hourOfDay];
  });
}

export default function LiveIsolationForest() {
  const [numTrees, setNumTrees] = useState(150);
  const [hasRun, setHasRun] = useState(false);
  const [scores, setScores] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    // Yielding to the next tick keeps the "Running..." state visible even
    // though this dataset is small enough to compute almost instantly —
    // on a larger point count this would matter for real.
    setTimeout(() => {
      const points = extractFeatures(transactions);
      const result = runIsolationForest(points, {
        numTrees,
        subSampleSize: points.length,
      });
      setScores(result);
      setHasRun(true);
      setIsRunning(false);
    }, 50);
  };

  const rankedResults = useMemo(() => {
    if (!scores) return [];
    return transactions
      .map((txn, index) => ({ txn, score: scores[index] }))
      .sort((a, b) => b.score - a.score);
  }, [scores]);

  return (
    <section className="iforest-section" aria-label="Live isolation forest">
      <div className="panel-header">
        <div>
          <span className="panel-kicker">Implemented from scratch &middot; runs in your browser</span>
          <h2>Live Isolation Forest</h2>
        </div>
        <span className="tech-mono muted-text">{numTrees} trees</span>
      </div>

      <p className="iforest-explainer">
        This isn&apos;t a call to any backend or a wrapped library — it&apos;s the
        actual Isolation Forest algorithm (Liu, Ting &amp; Zhou, 2008), implemented
        in JavaScript and run live, right here in your browser, against this
        page&apos;s transaction data. It builds {numTrees} random trees, each one
        repeatedly splitting transactions on a random feature and threshold. Points
        that get separated from the rest in just a few splits — because their amount
        or time-of-day looks unusual — get a higher anomaly score.
      </p>

      <p className="iforest-caveat">
        Honest caveat: with only {transactions.length} transactions and two real
        features (amount, time-of-day), the separation between &quot;normal&quot;
        and &quot;anomalous&quot; here is much weaker than it would be on a full
        dataset with more rows and features — small data limits any anomaly
        detector, real or mock. This is a correctness demo of the algorithm itself,
        not a production fraud score.
      </p>

      <div className="iforest-controls">
        <label className="iforest-tree-slider">
          <span>Number of trees: {numTrees}</span>
          <input
            type="range"
            min={10}
            max={300}
            step={10}
            value={numTrees}
            onChange={(event) => setNumTrees(Number(event.target.value))}
          />
        </label>
        <button type="button" className="iforest-run-button" onClick={handleRun} disabled={isRunning}>
          {isRunning ? "Running..." : hasRun ? "Re-run forest" : "Run isolation forest"}
        </button>
      </div>

      {hasRun && (
        <div className="iforest-results">
          <div className="transaction-table-wrap">
            <table className="transaction-table static-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Mock fraud score</th>
                  <th>Computed anomaly score</th>
                </tr>
              </thead>
              <tbody>
                {rankedResults.map(({ txn, score }, index) => (
                  <tr key={txn.transaction_id}>
                    <td className="tech-mono">{index + 1}</td>
                    <td className="tech-mono">{txn.transaction_id}</td>
                    <td className="tech-mono">${txn.amount.toLocaleString()}</td>
                    <td className="tech-mono">{txn.fraud_score.toFixed(2)}</td>
                    <td className="tech-mono">{score.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
