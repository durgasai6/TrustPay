from pydantic import BaseModel
from typing import Optional

class Transaction(BaseModel):
    payer_id: str
    payee_id: str
    amount: float
    timestamp: str  # ISO format: "2026-02-10T12:30:45"
    location: str
    device_id: str

class TransactionResult(BaseModel):
    transaction_id: str
    payer_id: str
    payee_id: str
    amount: float
    timestamp: str
    location: str
    device_id: str
    risk_score: int
    risk_level: str
    reasons: list[str]
    is_flagged: bool