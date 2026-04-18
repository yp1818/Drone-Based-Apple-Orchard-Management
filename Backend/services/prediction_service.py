import os
from ultralytics import YOLO

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "best.pt")

model = YOLO(MODEL_PATH)

CLASS_NAMES = [
    "apple_scab",
    "black_rot",
    "cedar_rust",
    "powdery_mildew",
    "healthy"
]

def predict_disease(file_path):
    results = model.predict(source=file_path, conf=0.25)

    output = []

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            cls = int(box.cls.item())
            conf = float(box.conf.item())

            output.append({
                "disease": CLASS_NAMES[cls],   
                "confidence": conf
            })

    return output