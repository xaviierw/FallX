export default function KPIs({ stats }) {
  const cards = [
    {
      title: "Falls (24h)",
      value: stats.falls24h,
      sub: "Last 24 hours",
    },
    {
      title: "Falls (7 days)",
      value: stats.falls7d,
      sub: "Last 7 days",
    },
    {
      title: "Avg time between falls",
      value: stats.avgBetweenHours === null ? "—" : `${stats.avgBetweenHours} hrs`,
      sub: "Across all residents",
    },
    {
      title: "Most affected resident",
      value: stats.mostAffected
        ? stats.mostAffected.residentName
        : "—",
      sub: stats.mostAffected
        ? `${stats.mostAffected.count} falls (7d)`
        : "",
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c) => (
        <div className="kpi-card" key={c.title}>
          <div className="kpi-title">{c.title}</div>
          <div className="kpi-value">{c.value}</div>
          <div className="kpi-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
