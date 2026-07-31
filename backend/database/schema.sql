-- Sentinel fraud detection database schema
-- Run against the fraud_detection database before starting the backend:
--   psql -U postgres -d fraud_detection -f database/schema.sql

CREATE TABLE IF NOT EXISTS transactions (
    id               SERIAL PRIMARY KEY,
    transaction_id   TEXT NOT NULL UNIQUE,
    amount           NUMERIC(12, 2),
    country          TEXT,
    fraud_score      NUMERIC(6, 4),
    prediction       TEXT,
    risk_level       TEXT,
    alert_triggered  BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_prediction
    ON transactions (prediction);

CREATE INDEX IF NOT EXISTS idx_transactions_created_at
    ON transactions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_risk_level
    ON transactions (risk_level);
