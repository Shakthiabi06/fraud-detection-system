# FastAPI app entrypoint.
# Defines /predict, /transactions, /fraud-summary routes.
# See docs/API.md for the locked API contract.

from fastapi import FastAPI

app = FastAPI(title="Credit Card Fraud Detection API")

# TODO: implement POST /predict — scores a single transaction via predict.py
# TODO: implement GET /transactions — returns stored transactions (joined with synthetic metadata for display)
# TODO: implement GET /fraud-summary — returns aggregate fraud stats for the dashboard
