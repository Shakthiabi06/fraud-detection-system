import { modelMetrics } from "../mock/sampleData";

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
