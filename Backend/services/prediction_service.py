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
    processed_path = None

    for r in results:
        # Save the actual model visualization
        # We try to use boxes=False if masks exist to answer user request "mark the infected part only"
        # but r.save doesn't accept plot args directly in some versions, so we use r.plot()
        # Actually r.save() just plots with default args. We can do:
        import cv2
        plotted = r.plot(boxes=False) if r.masks is not None else r.plot()
        
        base, ext = os.path.splitext(file_path)
        processed_path = f"{base}_processed{ext}"
        cv2.imwrite(processed_path, plotted)

        if r.boxes is None:
            continue

        for box in r.boxes:
            cls = int(box.cls.item())
            conf = float(box.conf.item())

            output.append({
                "disease": CLASS_NAMES[cls],   
                "confidence": conf
            })

    return output, processed_path