-- Locked transactions table schema.
-- See docs/DATABASE.md for documentation of this schema.
--
-- risk_level added after initial lock: stores the Low/Medium/High/Critical
-- bucket computed by risk_rules.py, so the frontend never needs to
-- duplicate that threshold logic in JavaScript.

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(50),
    amount DECIMAL(12,2),
    country VARCHAR(50),
    fraud_score FLOAT,
    prediction VARCHAR(20),
    risk_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MIGRATION NOTE (for existing databases created before risk_level existed)
-- ============================================================
-- If your local database already has a transactions table WITHOUT
-- risk_level (i.e. you ran this schema before this column was added),
-- run this manually instead of recreating the table:
--
-- ALTER TABLE transactions ADD COLUMN risk_level VARCHAR(20);
--
-- Do not run CREATE TABLE again on an existing database because it will fail
-- if the table already exists. This migration path has already been applied
-- to the developer's local database before this Step 4 code integration.
-- ============================================================
