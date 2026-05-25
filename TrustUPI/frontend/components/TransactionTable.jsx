function TransactionTable({ transactions, txs }) {
  const list = transactions && transactions.length ? transactions : (txs || []);

  if (!list || list.length === 0) {
    return (
      <div style={{
        background: "white", borderRadius: "12px", padding: "32px",
        textAlign: "center", color: "#9ca3af", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        No transactions yet. Submit one above!
      </div>
    );
  }

  const thStyle = {
    padding: "12px 14px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    borderBottom: "2px solid #f3f4f6",
  };

  const tdStyle = {
    padding: "12px 14px",
    fontSize: "13px",
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
  };

  const headers = ["Tx ID", "Payer", "Payee", "Amount", "Location", "Timestamp", "Score", "Level", "Reasons", "Status"];

  return (
    <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
        <h2 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>
          All Transactions ({list.length})
        </h2>
        <a
          href={typeof getExportUrl === 'function' ? getExportUrl() : '#'}
          rel="noreferrer"
          style={{
            padding: "8px 18px",
            background: "#10b981",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Export Flagged CSV
        </a>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {headers.map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...list].reverse().map((tx) => (
              <tr key={tx.transaction_id} style={{ background: tx.is_flagged ? "#fff7f7" : "white" }}>
                <td style={tdStyle}><code>{tx.transaction_id}</code></td>
                <td style={tdStyle}>{tx.payer_id}</td>
                <td style={tdStyle}>{tx.payee_id}</td>
                <td style={tdStyle}>Rs.{tx.amount.toLocaleString()}</td>
                <td style={tdStyle}>{tx.location}</td>
                <td style={tdStyle}>{tx.timestamp.replace("T", " ")}</td>
                <td style={{ ...tdStyle, fontWeight: "bold" }}>{tx.risk_score}</td>
                <td style={tdStyle}><AlertBadge score={tx.risk_score} reasons={tx.reasons} /></td>
                <td style={{ ...tdStyle, maxWidth: "200px", fontSize: "11px", color: "#6b7280" }}>
                  {tx.reasons.length > 0 ? tx.reasons.join(", ") : "none"}
                </td>
                <td style={tdStyle}>
                  {tx.is_flagged ? "FLAGGED" : "SAFE"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// expose component in global scope for non-module environment
window.TransactionTable = TransactionTable;