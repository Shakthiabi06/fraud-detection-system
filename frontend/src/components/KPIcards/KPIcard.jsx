// variant controls sizing/emphasis to match the kpi-grid layout in index.css:
// "primary" -> spans 5 cols, larger text (was .primary-kpi)
// "compact" -> spans 2 cols (was .compact-kpi)
// "compact-offset" -> spans 2 cols, nudged down (was .compact-kpi.offset-kpi)
// "latency" -> spans 3 cols (was .latency-kpi)
const variantClassMap = {
  primary: "primary-kpi",
  compact: "compact-kpi",
  "compact-offset": "compact-kpi offset-kpi",
  latency: "latency-kpi",
};

export default function KPIcard({ title, value, subtitle, variant }) {
  const variantClass = variantClassMap[variant] || "";

  return (
    <article className={`kpi-card${variantClass ? ` ${variantClass}` : ""}`}>
      <span>{title}</span>
      <p>{value}</p>
      {subtitle && <small>{subtitle}</small>}
    </article>
  );
}
