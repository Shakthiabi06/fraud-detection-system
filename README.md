# Credit Card Fraud Detection

A fraud detection system trained on the Kaggle "Credit Card Fraud Detection" dataset
(anonymized European cardholder transactions). The backend trains an Isolation Forest
on the original anonymized features and serves predictions via FastAPI; the frontend
is a dashboard for reviewing flagged transactions.

See `docs/case-study.md` for an important disclosure about synthetic dashboard fields.

## Dataset

Kaggle "Credit Card Fraud Detection" dataset — link placeholder: `<KAGGLE_DATASET_URL>`.

Download `creditcard.csv` and place it in `backend/data/` (not committed to git).

## Setup

### Backend

```
cd backend
pip install -r requirements.txt
python train.py          # trains the Isolation Forest model
uvicorn app:app --reload # runs the API
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## Team structure

- `backend-ml` — model training, scoring API, risk rules
- `frontend-dashboard` — dashboard UI, charts, transaction views

Work happens on feature branches off `main`; do not push directly to `main`.

## Docs

- `docs/API.md` — API contract
- `docs/DATABASE.md` — database schema
- `docs/ARCHITECTURE.md` — data flow / architecture
- `docs/case-study.md` — project write-up and synthetic-data disclosure
