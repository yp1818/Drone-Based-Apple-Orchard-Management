import json
import traceback
from fastapi import APIRouter, UploadFile, Form, File
from utils.file_handler import save_file
from services.prediction_service import predict_disease
from utils.logic import generate_advisory, predict_yield
from collections import Counter
from database import SessionLocal
from models import OrchardImage, OrchardHealthHistory, Advisory, YieldPrediction

router = APIRouter()

DISEASE_MAP = {
    "apple_scab": 1,
    "black_rot": 2,
    "cedar_rust": 3,
    "powdery_mildew": 4,
    "healthy": 5
}

def get_health_status(disease):
    return "healthy" if disease == "healthy" else "moderate"


@router.post("/")
async def predict(file: UploadFile = File(...), user_id: int = Form(0)):   # Provide default to avoid 422
    print("PREDICT ROUTE HIT")
    file_path = save_file(file)

    predictions, processed_image_path = predict_disease(file_path)

    if not predictions:
        return {"result": "No disease detected"}

    disease_predictions = [p for p in predictions if p["disease"] != "healthy"]

    other_diseases = []

    if disease_predictions:
        diseases = [p["disease"] for p in disease_predictions]
        most_common = Counter(diseases).most_common(1)[0][0]

        best = max(
            [p for p in disease_predictions if p["disease"] == most_common],
            key=lambda x: x["confidence"]
        )
        
        seen = set()
        for p in disease_predictions:
            if p["disease"] != best["disease"] and p["disease"] not in seen:
                other_diseases.append({"disease": p["disease"], "confidence": p["confidence"]})
                seen.add(p["disease"])
    else:
        best = {"disease": "healthy", "confidence": 1.0}

    advisory_msg = generate_advisory(best["disease"])
    health_status = get_health_status(best["disease"])
    predicted_yield_val = predict_yield(health_status)

    try:
        db = SessionLocal()

        disease_id = DISEASE_MAP.get(best["disease"])
        
        print(f"--- DB INSERT START ---")
        print(f"User ID: {user_id}")
        print(f"Disease: {best['disease']}")
        print(f"Health Status: {health_status}")

        image_record = OrchardImage(
            user_id=user_id,   #  FIXED HERE
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
        
        advisory_record = Advisory(
            user_id=user_id,
            advice_type=best["disease"],
            advice_content=json.dumps(advisory_msg)
        )
        db.add(advisory_record)
        
        # Calculate arbitrary health score
        hs_map = {"healthy": 0.9, "moderate": 0.6, "poor": 0.3}
        health_score_val = hs_map.get(health_status, 0.6)

        # Save Yield Prediction
        yield_record = YieldPrediction(
            user_id=user_id,
            health_score=health_score_val,
            predicted_yield=float(predicted_yield_val),
            model_version="v1.0"
        )
        db.add(yield_record)

        print("Before db.commit() for history, advisory, yield...")
        db.commit()
        print("After db.commit() - Success!")
        db.close()

    except Exception as e:
        print("DATABASE ERROR:", e)
        traceback.print_exc()

    # Use FastAPI url for static to ensure correct frontend rendering
    processed_url = f"http://127.0.0.1:8000/{processed_image_path}" if processed_image_path else ""

    return {
        "result": {
            "disease": best["disease"],
            "confidence": best["confidence"],
            "health_status": health_status,
            "advisory": advisory_msg,
            "processed_image_url": processed_url,
            "similar_diseases": other_diseases,
            "predicted_yield": predicted_yield_val
        }
    }