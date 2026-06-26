"""Rule-based risk adjustments layered on top of the ML model's fraud_score.

This logic runs strictly AFTER predict.py produces fraud_score —
it is not part of model training and must stay separate from the ML pipeline.
Rules use synthetic/display metadata (e.g. country) that the model never sees.
"""

import logging

logger = logging.getLogger("fraud_alerts")

COUNTRY_RISK_MAP = {
    "IN": 0.1,
    "US": 0.1,
    "GB": 0.1,
    "DE": 0.1,
    "FR": 0.1,
    "RU": 0.7,
    "NG": 0.6,
    "CN": 0.3,
    "BR": 0.2,
    "AE": 0.2,
}


def amount_risk(amount: float) -> float:
    # This is a simple demo heuristic, not derived from the real amount distribution.
    # It can be refined later using customer-level spending patterns.
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        amount = 0.0

    if amount < 0:
        amount = 0.0

    return min(amount / 5000, 1.0)


def country_risk(country: str) -> float:
    # This map is illustrative for the demo and is not a real fraud-risk-by-country dataset.
    if not country:
        return 0.5

    return COUNTRY_RISK_MAP.get(str(country).upper(), 0.5)


def hour_risk(time_seconds: float) -> float:
    # Kaggle Time is elapsed seconds since the first transaction, not true wall-clock time.
    # This hour calculation is a demo approximation.
    try:
        time_seconds = float(time_seconds)
    except (TypeError, ValueError):
        time_seconds = 0.0

    hour = int(time_seconds // 3600) % 24

    if hour <= 5:
        return 0.6
    if hour >= 22:
        return 0.4
    return 0.1


def risk_level(score: float) -> str:
    score = max(0.0, min(float(score), 1.0))

    if score <= 0.30:
        return "Low"
    if score <= 0.60:
        return "Medium"
    if score <= 0.80:
        return "High"
    return "Critical"


def compute_final_risk(
    ml_fraud_score: float,
    amount: float,
    country: str,
    time_seconds: float,
) -> dict:
    """Combine the ML fraud score with business risk factors.

    final_score = (0.6 * ml_fraud_score) + (0.4 * business_risk)

    business_risk is the average of:
    amount_risk
    country_risk
    hour_risk

    ML score is the dominant signal at 60%.
    Business rules provide a secondary 40% adjustment.
    This keeps the project ML-led while adding a finance/risk layer.
    """
    a_risk = amount_risk(amount)
    c_risk = country_risk(country)
    h_risk = hour_risk(time_seconds)

    business_risk = (a_risk + c_risk + h_risk) / 3

    final_score = (0.6 * ml_fraud_score) + (0.4 * business_risk)
    final_score = max(0.0, min(final_score, 1.0))
    final_score = round(final_score, 4)

    prediction = "Fraud" if final_score > 0.5 else "Legitimate"
    risk_level_value = risk_level(final_score)

    # alert_triggered follows the project's locked alert rule: fraud_score > 0.85.
    # This signal lets the frontend build dashboard notifications without needing
    # real email infrastructure — email delivery is intentionally out of scope
    # for this step; this only exposes the trigger condition as data.
    alert_triggered = final_score > 0.85

    # This log line is a stand-in for a future notification channel.
    # The decision of WHEN to alert stays separate from HOW alerts are delivered.
    if alert_triggered:
        logger.warning(
            "[ALERT] High-risk transaction flagged: "
            "fraud_score=%.4f, risk_level=%s",
            final_score,
            risk_level_value,
        )

    return {
        "final_score": final_score,
        "prediction": prediction,
        "risk_level": risk_level_value,
        "alert_triggered": alert_triggered,
        "breakdown": {
            "ml_fraud_score": round(float(ml_fraud_score), 4),
            "amount_risk": round(a_risk, 4),
            "country_risk": round(c_risk, 4),
            "hour_risk": round(h_risk, 4),
        },
    }


if __name__ == "__main__":
    sample_result = compute_final_risk(
        ml_fraud_score=0.72,
        amount=4500,
        country="RU",
        time_seconds=7200,
    )
    print("Smoke test result:", sample_result)
