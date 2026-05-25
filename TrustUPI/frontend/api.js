const BASE_URL = "http://localhost:8000";

async function getAllTransactions() {
  const res = await fetch(`${BASE_URL}/transactions`);
  return res.json();
}

async function getStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  return res.json();
}

async function resetAll() {
  const res = await fetch(`${BASE_URL}/reset`, { method: "DELETE" });
  return res.json();
}

function getExportUrl() {
  return `${BASE_URL}/transactions/export-csv`;
}