from rules import (
    check_velocity,
    check_midnight,
    check_device_change,
    check_new_merchant_high_amount,
    check_repeated_amount,
    update_trackers
)


def get_risk_level(score: int) -> str:
    if score >= 75:
        return "CRITICAL"
    elif score >= 50:
        return "HIGH"
    elif score >= 25:
        return "MEDIUM"
    else:
        return "LOW"


def evaluate_transaction(tx: dict) -> dict:
    payer_id = tx["payer_id"]
    payee_id = tx["payee_id"]
    amount = tx["amount"]
    timestamp = tx["timestamp"]
    device_id = tx["device_id"]

    # Run all rules
    s1, r1 = check_velocity(payer_id, timestamp)
    s2, r2 = check_midnight(timestamp)
    s3, r3 = check_device_change(payer_id, device_id, payee_id)
    s4, r4 = check_new_merchant_high_amount(payer_id, payee_id, amount)
    s5, r5 = check_repeated_amount(payer_id, amount)

    total_score = min(s1 + s2 + s3 + s4 + s5, 100)
    all_reasons = r1 + r2 + r3 + r4 + r5

    # Update trackers AFTER scoring
    update_trackers(payer_id, payee_id, device_id, timestamp, amount)

    risk_level = get_risk_level(total_score)

    return {
        "risk_score": total_score,
        "risk_level": risk_level,
        "reasons": all_reasons,
        "is_flagged": total_score >= 50
    }