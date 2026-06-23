# Feature engineering applied before model training/inference.
#
# Operates only on the original anonymized features (Time, V1-V28, Amount) —
# country/merchant are never touched here, since they don't exist at this stage
# of the pipeline.

# TODO: log-transform Amount (e.g. log1p) to reduce skew
# TODO: extract hour-of-day from Time
# TODO: extract day-of-week from Time
# TODO: compute velocity features (e.g. rolling transaction count/amount per time window)
