import joblib
import pandas as pd
import numpy as np

# Load model
model = joblib.load("model/isolation_forest.pkl")

def predict_transaction(data):
    """Original function - returns just 'Fraud' or 'Legitimate'"""
    df = pd.DataFrame([data])
    df = df.reindex(columns=model.feature_names_in_, fill_value=0)
    pred = model.predict(df)
    return "Fraud" if pred[0] == -1 else "Legitimate"

# ADD THIS NEW FUNCTION:
def predict_transaction_with_score(data):
    """
    NEW FUNCTION: Returns prediction WITH fraud score
    This is what app.py is trying to import
    """
    df = pd.DataFrame([data])
    df = df.reindex(columns=model.feature_names_in_, fill_value=0)
    
    # Get prediction
    pred = model.predict(df)
    prediction = "Fraud" if pred[0] == -1 else "Legitimate"
    
    # Get decision score (distance from normal)
    score = model.decision_function(df)
    
    # Convert to probability-like score (0 to 1)
    # Higher = more likely fraud
    fraud_score = float(1 / (1 + np.exp(-score[0])))
    
    return {
        'prediction': prediction,
        'fraud_score': fraud_score
    }