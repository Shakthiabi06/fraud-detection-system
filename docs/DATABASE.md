# Database Schema

Documents `database/schema.sql`.

## transactions table

| Column         | Type      | Notes                                      |
|----------------|-----------|---------------------------------------------|
| id             | SERIAL    | Primary key                                 |
| transaction_id | TEXT      | Original dataset transaction identifier     |
| amount         | NUMERIC   | Transaction amount                          |
| country        | TEXT      | Synthetic, display-only metadata            |
| fraud_score    | REAL      | Isolation Forest anomaly score              |
| prediction     | INTEGER   | Binary fraud flag from the model            |
| created_at     | TIMESTAMP | Record creation time                        |

TODO: add indexes, constraints, and migration notes as the schema evolves.
