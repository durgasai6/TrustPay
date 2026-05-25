function Dashboard({ stats }) {
  if (!stats) return null;

  const cards = [
    { label: "Total Transactions", value: stats.total,          color: "#3b82f6" },
    { label: "Flagged",            value: stats.flagged,        color: "#ef4444" },
    { label: "Safe",               value: stats.safe,           color: "#22c55e" },
    { label: "Avg Risk Score",     value: stats.avg_risk_score, color: "#f59e0b" },
  ];

  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
      {cards.map((c) => (
        <div key={c.label} style={{
          flex: "1 1 160px",
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderTop: `4px solid ${c.color}`,
        }}>
          <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>{c.label}</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: c.color }}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}

window.Dashboard = Dashboard;