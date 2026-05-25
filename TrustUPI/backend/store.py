from collections import defaultdict

# All processed transactions
transactions: list[dict] = []

# Velocity tracker: payer_id -> list of timestamps
velocity_tracker: dict[str, list[str]] = defaultdict(list)

# Device tracker: payer_id -> last known device_id
device_tracker: dict[str, str] = {}

# Merchant tracker: payer_id -> set of known payee_ids
merchant_tracker: dict[str, set] = defaultdict(set)

# Amount history: payer_id -> list of past amounts (for pattern detection)
amount_history: dict[str, list[float]] = defaultdict(list)