# API Contract (Locked)

This document describes the locked API contract for the fraud detection backend.
Do not change these route signatures without updating this doc first.

## POST /predict

Scores a single transaction.

- TODO: request body schema (Time, V1-V28, Amount)
- TODO: response schema ({ fraud_score, prediction })

## GET /transactions

Returns stored transactions, joined with synthetic metadata (country, merchant) for display.

- TODO: query params (pagination, filters)
- TODO: response schema (list of transaction records)

## GET /fraud-summary

Returns aggregate fraud statistics for the dashboard.

- TODO: response schema (counts, rates, breakdowns)
