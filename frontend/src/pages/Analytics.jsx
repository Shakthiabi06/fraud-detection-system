import { candidateConfusionMatrix, modelMetrics } from "../mock/sampleData";
import ThresholdSlider from "../components/Charts/ThresholdSlider";

// Values are pulled from the candidate model in modelMetrics (sampleData.js)
// instead of being typed twice. Previously this file had its own hardcoded
// 94.0% / 88.0% / 91.0% / 0.96 that happened to match the Autoencoder row —
// but only because someone copied them by hand, with no actual link between
// the two. Now there's one source of truth.
const candidateModel =
  modelMetrics.find((model) => model.status === "Candidate") || modelMetrics[0];

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

const metricDefinitions = [
  {
    title: "Precision",
    value: formatPercent(candidateModel.precision),
    body: "Of all transactions predicted as fraud, how many were actually fraud.",
    tone: "cyan",
  },
  {
    title: "Recall",
    value: formatPercent(candidateModel.recall),
    body: "Of all real fraud transactions, how many the model successfully detected.",
    tone: "blue",
  },
  {
    title: "F1 Score",
    value: formatPercent(candidateModel.f1Score),
    body: "Balanced score combining precision and recall for uneven fraud datasets.",
    tone: "green",
  },
  {
    title: "ROC AUC",
    value: candidateModel.rocAuc.toFixed(2),
    body: "How well the model separates fraud from legitimate transactions.",
    tone: "amber",
  },
];

const {
  truePositive,
  falseNegative,
  falsePositive,
  trueNegative,
  total: confusionTotal,
} = candidateConfusionMatrix;

const confusionCells = [
  {
    key: "tp",
    label: "True Positive",
    value: truePositive,
    detail: "Correctly flagged as fraud",
    tone: "low",
  },
  {
    key: "fp",
    label: "False Positive",
    value: falsePositive,
    detail: "Flagged as fraud, actually legitimate",
    tone: "high",
  },
  {
    key: "fn",
    label: "False Negative",
    value: falseNegative,
    detail: "Missed — was actually fraud",
    tone: "critical",
  },
  {
    key: "tn",
    label: "True Negative",
    value: trueNegative,
    detail: "Correctly identified as legitimate",
    tone: "low",
  },
];

export default function Analytics() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">ML support</p>
          <h1 className="dashboard-title">Model Evaluation</h1>
          <p className="dashboard-subtitle">
            Mock analytics for precision, recall, F1, ROC AUC, and future model comparison.
          </p>
        </div>
        <div className="run-status">
          <span className="status-dot" />
          <span className="tech-mono">Mock metrics</span>
          <small>Waiting for backend</small>
        </div>
      </header>

      <section className="metric-definition-grid" aria-label="Model metric definitions">
        {metricDefinitions.map((metric) => (
          <article className={`metric-card ${metric.tone}`} key={metric.title}>
            <span>{metric.title}</span>
            <strong>{metric.value}</strong>
            <p>{metric.body}</p>
          </article>
        ))}
      </section>

      <section className="confusion-section" aria-label="Confusion matrix">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Candidate model · Autoencoder</span>
            <h2>What precision and recall mean in counts</h2>
          </div>
          <span className="tech-mono muted-text">Illustrative, scaled to {confusionTotal}</span>
        </div>
        <p className="confusion-note">
          This grid is not measured from real transactions — there are only 12 in the
          mock dataset, not enough to show a readable matrix. Instead these counts are
          scaled to {confusionTotal} simulated transactions and solved to reproduce the
          Autoencoder&apos;s stated precision ({formatPercent(candidateModel.precision)}) and
          recall ({formatPercent(candidateModel.recall)}) almost exactly, so you can see what
          those percentages mean as actual counts of caught fraud, missed fraud, and false alarms.
        </p>
        <div className="confusion-grid">
          {confusionCells.map((cell) => (
            <article className={`confusion-cell ${cell.tone}`} key={cell.key}>
              <span className="confusion-label">{cell.label}</span>
              <strong className="tech-mono confusion-value">{cell.value}</strong>
              <p className="confusion-detail">{cell.detail}</p>
            </article>
          ))}
        </div>
        <div className="tradeoff-note">
          <span className="panel-kicker">The tradeoff</span>
          <p>
            Catching more fraud (higher recall) usually means flagging more legitimate
            transactions by mistake (lower precision), and vice versa. Above,{" "}
            {falseNegative} fraud cases were still missed (false negatives) even at{" "}
            {formatPercent(candidateModel.recall)} recall — pushing recall higher would
            catch more of those, but would also raise the {falsePositive} false-positive
            count, since the model would be flagging more borderline transactions overall.
          </p>
        </div>

        <ThresholdSlider />
      </section>

      <main className="table-card">
        <div className="table-toolbar">
          <div>
            <span className="panel-kicker">Comparison</span>
            <h2>Isolation Forest vs Autoencoder</h2>
          </div>
          <span className="tech-mono muted-text">UI only until Person 1 API is ready</span>
        </div>

        <div className="transaction-table-wrap">
          <table className="transaction-table static-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1 Score</th>
                <th>ROC AUC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {modelMetrics.map((model) => (
                <tr key={model.name}>
                  <td title={model.name}>{model.name}</td>
                  <td className="tech-mono">{formatPercent(model.accuracy)}</td>
                  <td className="tech-mono">{formatPercent(model.precision)}</td>
                  <td className="tech-mono">{formatPercent(model.recall)}</td>
                  <td className="tech-mono">{formatPercent(model.f1Score)}</td>
                  <td className="tech-mono">{model.rocAuc.toFixed(2)}</td>
                  <td>
                    <span className={`risk-badge ${model.status === "Candidate" ? "low" : "medium"}`}>
                      {model.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
