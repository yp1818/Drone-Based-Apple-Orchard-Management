import cv2
from ultralytics import YOLO

model = YOLO(r"A:\Drone Apple Orchard Management System\dataset\best.pt")

image_path = r"A:\Drone Apple Orchard Management System\apple3.jpg"

results = model(image_path)

# Get plotted image
img = results[0].plot()

cv2.imshow("Prediction", img)
cv2.waitKey(0)
cv2.destroyAllWindows()