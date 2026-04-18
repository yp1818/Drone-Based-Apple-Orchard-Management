from fastapi import APIRouter, UploadFile
from utils.file_handler import save_file
from services.prediction_service import predict_disease
from services.advisory_service import get_advisory
from collections import Counter
from database import SessionLocal
from models import OrchardImage, OrchardHealthHistory

router = APIRouter()

DISEASE_MAP = {
    "apple_scab": 1,
    "black_rot": 2,
    "cedar_rust": 3,
    "powdery_mildew": 4,
    "healthy": 5
}

def get_health_status(disease):
    if disease == "healthy":
        return "healthy"
    else:
        return "moderate"

@router.post("/")
async def predict(file: UploadFile):
    file_path = save_file(file)

    predictions = predict_disease(file_path)

    if not predictions:
        return {"result": "No disease detected"}

    disease_predictions = [p for p in predictions if p["disease"] != "healthy"]

    if disease_predictions:
        diseases = [p["disease"] for p in disease_predictions]
        most_common = Counter(diseases).most_common(1)[0][0]

        best = max(
            [p for p in disease_predictions if p["disease"] == most_common],
            key=lambda x: x["confidence"]
        )
    else:
        best = {"disease": "healthy", "confidence": 1.0}

    advisory = get_advisory(best["disease"])

    # SAFE DATABASE PART 
    try:
        print(" DB CODE RUNNING")

        db = SessionLocal()

        disease_id = DISEASE_MAP.get(best["disease"])
        health_status = get_health_status(best["disease"])

        image_record = OrchardImage(
            user_id=1,
            disease_id=disease_id,
            image_filename=file.filename,
            image_path=file_path,
            health_classification=health_status,
            confidence_score=best["confidence"]
        )

        db.add(image_record)
        db.commit()
        db.refresh(image_record)

        history_record = OrchardHealthHistory(
            image_id=image_record.image_id,
            health_status=health_status
        )

        db.add(history_record)
        db.commit()

        db.close()

        print("DB SAVED SUCCESSFULLY")

    except Exception as e:
        print(" DATABASE ERROR:", e)
    #  ===== END =====

    return {
        "result": {
            "disease": best["disease"],
            "confidence": best["confidence"],
            "advisory": advisory
        }
    }