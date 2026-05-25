function AlertBadge({ score, reasons }) {
  const level = score >= 75 ? "CRITICAL"
              : score >= 50 ? "HIGH"
              : score >= 25 ? "MEDIUM"
              : "LOW";

  const colors = {
    LOW:      "#22c55e",
    MEDIUM:   "#f59e0b",
    HIGH:     "#ef4444",
    CRITICAL: "#7c3aed",
  };

  return (
    <span style={{
      padding: "3px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      background: colors[level],
      color: "white",
    }}>
      {level}
    </span>
  );
}

window.AlertBadge = AlertBadge;