from fastapi import APIRouter, UploadFile
from utils.file_handler import save_file
from services.prediction_service import predict_disease
from services.advisory_service import get_advisory
from collections import Counter

router = APIRouter()

@router.post("/")
async def predict(file: UploadFile):
    file_path = save_file(file)

    predictions = predict_disease(file_path)

    if not predictions:
        return {
            "result": "No disease detected"
        }

    #  remove healthy from predictions
    disease_predictions = [p for p in predictions if p["disease"] != "healthy"]

    if disease_predictions:
        #  find most frequent disease
        diseases = [p["disease"] for p in disease_predictions]
        most_common = Counter(diseases).most_common(1)[0][0]

        #  get best confidence for that disease
        best = max(
            [p for p in disease_predictions if p["disease"] == most_common],
            key=lambda x: x["confidence"]
        )
    else:
        # if only healthy detected
        best = {"disease": "healthy", "confidence": 1.0}

    advisory = get_advisory(best["disease"])

    return {
        "result": {
            "disease": best["disease"],
            "confidence": best["confidence"],
            "advisory": advisory
        }
    }