# Generates synthetic `country` and `merchant` columns appended to the raw dataset.
#
# Purpose: dashboard/display enrichment ONLY. This output is never fed into the
# Isolation Forest model — see train.py and predict.py, which only ever reference
# Time, V1-V28, and Amount. Run this script independently of the training pipeline.
#
# Output: data/creditcard_enriched.csv (raw columns + synthetic country/merchant)

# TODO: load data/creditcard.csv
# TODO: generate a synthetic country column (e.g. weighted random country codes)
# TODO: generate a synthetic merchant column (e.g. random merchant names/categories)
# TODO: write data/creditcard_enriched.csv for use by app.py when serving /transactions
