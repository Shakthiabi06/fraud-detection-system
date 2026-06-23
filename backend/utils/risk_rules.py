# Rule-based risk adjustments layered on top of the ML model's fraud_score.
#
# This logic runs strictly AFTER predict.py produces fraud_score/prediction —
# it is not part of model training and must stay separate from the ML pipeline.
# Rules use synthetic/display metadata (e.g. country) that the model never sees.

# TODO: define rule — if transaction country != user's historical usual country, add risk weight
# TODO: define rule — flag unusually high-velocity transaction bursts
# TODO: combine rule adjustments with fraud_score into a final display risk level
