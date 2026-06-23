export default function KPIcard({ title, value }) {
  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}