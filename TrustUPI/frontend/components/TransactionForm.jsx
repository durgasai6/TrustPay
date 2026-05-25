const BASE_URL = "http://localhost:8000";

const defaultForm = {
  payer_id: "",
  payee_id: "",
  amount: "",
  timestamp: "",
  location: "",
  device_id: "",
};

function TransactionForm({ onSubmitted }) {
  const [form, setForm] = React.useState(defaultForm);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const data = { ...form, amount: parseFloat(form.amount) };
    const res = await fetch(`${BASE_URL}/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
    if (onSubmitted) onSubmitted();
  }

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px",
    display: "block",
  };

  const fields = [
    { name: "payer_id",   label: "Payer ID",    placeholder: "e.g. 9988776655",        type: "text"           },
    { name: "payee_id",   label: "Payee ID",    placeholder: "e.g. MERCHANT121",       type: "text"           },
    { name: "amount",     label: "Amount (Rs)", placeholder: "e.g. 9500",              type: "number"         },
    { name: "device_id",  label: "Device ID",   placeholder: "e.g. ABC123",            type: "text"           },
    { name: "location",   label: "Location",    placeholder: "e.g. Delhi",             type: "text"           },
    { name: "timestamp",  label: "Timestamp",   placeholder: "2026-02-10T12:30:45",    type: "datetime-local" },
  ];

  return (
    <div style={{
      background: "white", borderRadius: "12px", padding: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "24px",
    }}>
      <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "18px", color: "#111827" }}>
        Submit Transaction
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {fields.map((field) => (
            <div key={field.name}>
              <label style={labelStyle}>{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "10px 28px",
            background: loading ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Transaction"}
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: "20px", padding: "16px", borderRadius: "10px",
          background: result.is_flagged ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${result.is_flagged ? "#fca5a5" : "#86efac"}`,
        }}>
          <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px" }}>
            {result.is_flagged ? "FLAGGED" : "SAFE"} — Risk Score: {result.risk_score}/100
          </div>
          <div style={{ fontSize: "14px", color: "#374151" }}>
            <strong>Level:</strong> {result.risk_level}
          </div>
          <div style={{ fontSize: "14px", color: "#374151", marginTop: "4px" }}>
            <strong>Reasons:</strong> {result.reasons && result.reasons.length > 0 ? result.reasons.join(", ") : "None"}
          </div>
        </div>
      )}
    </div>
  );
}

window.TransactionForm = TransactionForm;