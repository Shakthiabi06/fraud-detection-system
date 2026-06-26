"""SQLAlchemy engine, session, and ORM models — single source of truth for the database layer.

The transactions table is created and managed via database/schema.sql, not
SQLAlchemy migrations, to keep one source of truth for the schema. This
module intentionally never calls Base.metadata.create_all(); doing so would
risk schema drift between this model and the real table.
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import DECIMAL, Boolean, Column, Float, Integer, String, TIMESTAMP, create_engine, func
from sqlalchemy.orm import declarative_base, sessionmaker

# Load backend/.env relative to this file so DATABASE_URL resolves
# regardless of the process's current working directory (e.g. running
# uvicorn from backend/ vs. running tests from the repo root).
load_dotenv(Path(__file__).resolve().parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Define it in backend/.env (see backend/.env.example)."
    )

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50))
    amount = Column(DECIMAL(12, 2))
    country = Column(String(50))
    fraud_score = Column(Float)
    prediction = Column(String(20))
    risk_level = Column(String(20))
    alert_triggered = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
