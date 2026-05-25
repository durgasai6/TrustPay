function App() {
  const [transactions, setTransactions] = React.useState([]);
  const [stats, setStats] = React.useState(null);

  async function refresh() {
    const [txs, st] = await Promise.all([getAllTransactions(), getStats()]);
    setTransactions(txs);
    setStats(st);
  }

  React.useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleReset() {
    if (confirm("Reset all transactions?")) {
      await resetAll();
      refresh();
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        padding: "20px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
      }}>
        <div>
          <h1 style={{ margin: 0, color: "white", fontSize: "22px", fontWeight: "800" }}>
            UPI Fraud Detector
          </h1>
          <p style={{ margin: 0, color: "#bfdbfe", fontSize: "13px" }}>
            Real-time rule-based fraud analysis
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{
            padding: "8px 18px",
            background: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Reset All
        </button>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>
        <Dashboard stats={stats} />
        <TransactionForm onSubmitted={refresh} />
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);