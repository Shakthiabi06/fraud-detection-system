"""Generates synthetic/demo columns appended to the raw Kaggle dataset.

These fields are synthetic.
They are not real transaction attributes.
They exist only for dashboarding, API testing, and business-rule demo purposes.
They must never be used as Isolation Forest training features or direct model inputs.

Purpose: dashboard/display enrichment ONLY. This output is never fed into the
Isolation Forest model — see train.py and predict.py, which only ever reference
V1-V28, Amount_scaled, and Time_scaled. Run this script independently of the
training pipeline.

Output: backend/data/creditcard_enriched.csv (raw columns + synthetic columns)
"""

import numpy as np
import pandas as pd
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent / "data" / "creditcard.csv"
OUTPUT_PATH = Path(__file__).resolve().parent / "data" / "creditcard_enriched.csv"

SEED = 42

COUNTRIES = ["IN", "US", "GB", "RU", "CN", "NG", "BR", "DE", "FR", "AE"]
MERCHANT_CATEGORIES = [
    "grocery",
    "electronics",
    "travel",
    "fuel",
    "online_retail",
    "dining",
    "jewelry",
    "utilities",
]
CHANNELS = ["online", "in_store", "atm", "mobile_app"]
NUM_CUSTOMERS = 500

SYNTHETIC_COLUMNS = [
    "transaction_id",
    "country",
    "merchant_category",
    "customer_id",
    "channel",
]


def enrich_dataset() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            "Download the Kaggle Credit Card Fraud Detection dataset and place "
            "creditcard.csv at backend/data/creditcard.csv before continuing."
        )

    df = pd.read_csv(DATA_PATH)
    rng = np.random.default_rng(SEED)
    num_rows = len(df)

    df["transaction_id"] = [f"TXN{i + 1:06d}" for i in range(num_rows)]
    df["country"] = rng.choice(COUNTRIES, size=num_rows)
    df["merchant_category"] = rng.choice(MERCHANT_CATEGORIES, size=num_rows)

    customer_pool = [f"CUST{i + 1:04d}" for i in range(NUM_CUSTOMERS)]
    df["customer_id"] = rng.choice(customer_pool, size=num_rows)

    df["channel"] = rng.choice(CHANNELS, size=num_rows)

    return df


if __name__ == "__main__":
    enriched = enrich_dataset()
    enriched.to_csv(OUTPUT_PATH, index=False)

    print("Rows processed:", len(enriched))
    print("Output saved to:", OUTPUT_PATH)
    print("First 3 rows of synthetic columns:")
    print(enriched[SYNTHETIC_COLUMNS].head(3))
