from datetime import datetime, timedelta
from store import velocity_tracker, device_tracker, merchant_tracker, amount_history

HIGH_AMOUNT_THRESHOLD = 10000  # INR
REPEAT_AMOUNT_COUNT = 3        # same amount X times = suspicious


def check_velocity(payer_id: str, timestamp: str):
    """
    Flag if payer sends more than 10 transactions within a 5-minute window.
    Indicates automated or bot-driven fraud attempts.
    """
    reasons = []
    score = 0
    now = datetime.fromisoformat(timestamp)
    window_start = now - timedelta(minutes=5)

    recent = [
        t for t in velocity_tracker[payer_id]
        if datetime.fromisoformat(t) >= window_start
    ]

    if len(recent) >= 10:
        reasons.append("VELOCITY_BREACH")
        score += 40

    return score, reasons


def check_midnight(timestamp: str):
    """
    Flag transactions between 12am and 5am.
    Unusual hours indicate potential unauthorized access.
    """
    reasons = []
    score = 0
    hour = datetime.fromisoformat(timestamp).hour

    if 0 <= hour < 5:
        reasons.append("UNUSUAL_HOUR")
        score += 20

    return score, reasons


def check_device_change(payer_id: str, device_id: str, payee_id: str):
    """
    Flag if device changed AND payee is new — both together indicate higher risk.
    Simulates SIM swap or stolen device used to pay a new beneficiary.
    """
    reasons = []
    score = 0

    device_changed = (
        payer_id in device_tracker and
        device_tracker[payer_id] != device_id
    )

    new_beneficiary = payee_id not in merchant_tracker[payer_id]

    if device_changed and new_beneficiary:
        reasons.append("DEVICE_CHANGE_WITH_NEW_BENEFICIARY")
        score += 30

    return score, reasons


def check_new_merchant_high_amount(payer_id: str, payee_id: str, amount: float):
    """
    Flag if payer is transacting with a merchant for the first time
    AND the amount is above the high-value threshold.
    Common pattern in social engineering fraud.
    """
    reasons = []
    score = 0

    is_new_merchant = payee_id not in merchant_tracker[payer_id]

    if is_new_merchant and amount >= HIGH_AMOUNT_THRESHOLD:
        reasons.append("NEW_MERCHANT_HIGH_AMOUNT")
        score += 30

    return score, reasons


def check_repeated_amount(payer_id: str, amount: float):
    """
    Flag if payer has sent the exact same amount 3 or more times.
    Basic historical patterning — indicates scripted/automated transactions.
    """
    reasons = []
    score = 0

    history = amount_history[payer_id]
    count = history.count(amount)

    if count >= REPEAT_AMOUNT_COUNT:
        reasons.append("REPEATED_AMOUNT_PATTERN")
        score += 25

    return score, reasons


def update_trackers(payer_id: str, payee_id: str, device_id: str, timestamp: str, amount: float):
    """
    Update all in-memory trackers after a transaction is scored.
    Called AFTER scoring so current transaction doesn't affect its own score.
    """
    velocity_tracker[payer_id].append(timestamp)
    device_tracker[payer_id] = device_id
    merchant_tracker[payer_id].add(payee_id)
    amount_history[payer_id].append(amount)