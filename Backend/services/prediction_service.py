import os
from services.model_loader import model

CLASS_NAMES = [
    "apple_scab",
    "black_rot",
    "cedar_rust",
    "powdery_mildew",
    "healthy"
]

def predict_disease(file_path):
    results = model.predict(source=file_path, conf=0.25, imgsz=320)

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

        img_h, img_w = r.orig_shape
        total_area = img_h * img_w

        for box in r.boxes:
            cls = int(box.cls.item())
            conf = float(box.conf.item())

            xyxy = box.xyxy[0].tolist()
            box_area = (xyxy[2] - xyxy[0]) * (xyxy[3] - xyxy[1])
            coverage_pct = (box_area / total_area) * 100 if total_area > 0 else 0

            output.append({
                "disease": CLASS_NAMES[cls],   
                "confidence": conf,
                "coverage_pct": coverage_pct
            })

    return output, processed_path
