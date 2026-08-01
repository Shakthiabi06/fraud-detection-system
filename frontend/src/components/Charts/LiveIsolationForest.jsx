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
  const [progress, setProgress] = useState({ built: 0, total: numTrees, mode: "tree-build" });

  const handleRun = async () => {
    setIsRunning(true);
    setHasRun(false);
    setProgress({ built: 0, total: numTrees, mode: "tree-build" });

    const points = extractFeatures(transactions);
    const result = await runIsolationForest(
      points,
      {
        numTrees,
        subSampleSize: points.length,
      },
      (update) => {
        setProgress(update);
      },
    );

    setScores(result);
    setHasRun(true);
    setIsRunning(false);
  };

  const rankedResults = useMemo(() => {
    if (!scores) return [];
    return transactions
      .map((txn, index) => ({ txn, score: scores[index] }))
      .sort((a, b) => b.score - a.score);
  }, [scores]);

  const treeProgress = Math.max(
    0,
    Math.min(1, progress.built / Math.max(progress.total, 1)),
  );

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

      {isRunning && (
        <div className="iforest-progress" aria-live="polite">
          <div className="iforest-progress-row">
            <span className="tech-mono">Building forest</span>
            <span className="tech-mono">
              {progress.built}/{progress.total} trees
            </span>
          </div>
          <div className="iforest-progress-bar" aria-hidden="true">
            <div
              className="iforest-progress-fill"
              style={{ width: `${treeProgress * 100}%` }}
            />
          </div>
        </div>
      )}

      {hasRun && (
        <div className="iforest-results">
          <div className="iforest-result-table-wrap">
            <table className="iforest-result-table">
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
