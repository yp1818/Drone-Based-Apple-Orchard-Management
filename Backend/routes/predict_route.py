from fastapi import APIRouter, UploadFile
from utils.file_handler import save_file
from services.prediction_service import predict_disease
from services.advisory_service import get_advisory

router = APIRouter()

@router.post("/")
async def predict(file: UploadFile):
    file_path = save_file(file)

    predictions = predict_disease(file_path)

  
    if not predictions:
        return {
            "result": "No disease detected"
        }

    # 🔥 best prediction (highest confidence)
    best = max(predictions, key=lambda x: x["confidence"])

    advisory = get_advisory(best["disease"])

    return {
        "result": {
            "disease": best["disease"],
            "confidence": best["confidence"],
            "advisory": advisory
        }
    }