from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from models import Transaction
from scorer import evaluate_transaction
from store import transactions, velocity_tracker, device_tracker, merchant_tracker, amount_history
import uuid
import csv
import io

app = FastAPI(title="UPI Fraud Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/transaction")
def process_transaction(tx: Transaction):
    try:
        tx_dict = tx.dict()
        result = evaluate_transaction(tx_dict)
        record = {
            "transaction_id": str(uuid.uuid4())[:8],
            **tx_dict,
            **result
        }
        transactions.append(record)
        return record
    except Exception as e:
        return {"error": str(e)}


@app.get("/transactions/flagged")
def get_flagged():
    return [t for t in transactions if t["is_flagged"]]


@app.get("/transactions/export-csv")
def export_csv():
    flagged = [t for t in transactions if t["is_flagged"]]
    if not flagged:
        return {"message": "No flagged transactions"}

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=flagged[0].keys())
    writer.writeheader()
    for row in flagged:
        row_copy = row.copy()
        row_copy["reasons"] = " | ".join(row_copy["reasons"])
        writer.writerow(row_copy)

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=flagged_transactions.csv"}
    )


@app.get("/transactions")
def get_all_transactions():
    return transactions


@app.get("/stats")
def get_stats():
    total = len(transactions)
    flagged = len([t for t in transactions if t["is_flagged"]])
    avg_score = round(sum(t["risk_score"] for t in transactions) / total, 1) if total else 0
    return {
        "total": total,
        "flagged": flagged,
        "safe": total - flagged,
        "avg_risk_score": avg_score
    }


@app.delete("/reset")
def reset():
    transactions.clear()
    velocity_tracker.clear()
    device_tracker.clear()
    merchant_tracker.clear()
    amount_history.clear()
    return {"message": "Reset successful"}