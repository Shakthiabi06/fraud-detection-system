import { useMemo, useState } from "react";
import { fraudLikelihoodScores } from "../../mock/sampleData";

const { fraudCases, legitimateCases, defaultThreshold } = fraudLikelihoodScores;

export default function ThresholdSlider() {
  const [threshold, setThreshold] = useState(defaultThreshold);

  // Recompute the confusion counts live as the threshold moves. A score at
  // or above the threshold is flagged as fraud; below it, flagged as
  // legitimate. This is exactly how a real classifier turns a continuous
  // score into a yes/no decision — the threshold IS the dial that trades
  // precision against recall.
  const { tp, fp, fn, tn, precision, recall } = useMemo(() => {
    let truePositive = 0;
    let falseNegative = 0;
    let falsePositive = 0;
    let trueNegative = 0;

    fraudCases.forEach((score) => {
      if (score >= threshold) truePositive += 1;
      else falseNegative += 1;
    });

    legitimateCases.forEach((score) => {
      if (score >= threshold) falsePositive += 1;
      else trueNegative += 1;
    });

    const precisionValue =
      truePositive + falsePositive > 0
        ? truePositive / (truePositive + falsePositive)
        : 0;
    const recallValue =
      truePositive + falseNegative > 0
        ? truePositive / (truePositive + falseNegative)
        : 0;

    return {
      tp: truePositive,
      fp: falsePositive,
      fn: falseNegative,
      tn: trueNegative,
      precision: precisionValue,
      recall: recallValue,
    };
  }, [threshold]);

  const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="threshold-slider">
      <div className="threshold-slider-header">
        <div>
          <span className="panel-kicker">Try it yourself</span>
          <h3>Move the decision threshold</h3>
        </div>
        <span className="tech-mono threshold-value">
          Threshold: {threshold.toFixed(2)}
        </span>
      </div>

      <p className="threshold-explainer">
        A transaction is flagged as fraud when its score is at or above this line.
        Drag it and watch precision and recall move in opposite directions — this
        is the same 200-transaction simulation behind the confusion matrix above,
        just letting you pick the cutoff instead of seeing one fixed snapshot.
      </p>

      <input
        type="range"
        className="threshold-input"
        min={0}
        max={1}
        step={0.01}
        value={threshold}
        onChange={(event) => setThreshold(Number(event.target.value))}
        aria-label="Fraud decision threshold"
      />
      <div className="threshold-scale-labels">
        <span>0.00 — flag everything</span>
        <span>1.00 — flag nothing</span>
      </div>

      <div className="threshold-results">
        <div className="threshold-result-metric">
          <span>Precision</span>
          <strong className="tech-mono">{formatPercent(precision)}</strong>
        </div>
        <div className="threshold-result-metric">
          <span>Recall</span>
          <strong className="tech-mono">{formatPercent(recall)}</strong>
        </div>
        <div className="threshold-result-counts">
          <span>
            TP <strong className="tech-mono">{tp}</strong>
          </span>
          <span>
            FP <strong className="tech-mono">{fp}</strong>
          </span>
          <span>
            FN <strong className="tech-mono">{fn}</strong>
          </span>
          <span>
            TN <strong className="tech-mono">{tn}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
