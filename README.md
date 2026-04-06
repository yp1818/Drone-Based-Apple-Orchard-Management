#Minor Project: Drone-Based Intelligent System for Apple Orchard Management

# AI-Based Plant Disease Detection System

## Overview

This project is a deep learning–based system designed to detect plant diseases from leaf images. It uses a trained YOLO (You Only Look Once) model to identify diseases and provides actionable advisory recommendations. The system is implemented with a FastAPI backend, enabling efficient and real-time image processing.

The primary objective of this project is to demonstrate how artificial intelligence can be applied in agriculture to assist in early disease detection and improve crop management decisions.

---

## Objectives

* To develop an automated system for detecting plant diseases using image input
* To integrate a deep learning model for accurate classification
* To provide advisory suggestions based on detected diseases
* To build a scalable backend system using FastAPI

---

## System Workflow

The system follows a structured pipeline:

1. The user uploads an image of a plant leaf through the frontend interface
2. The image is sent to the FastAPI backend via an API request
3. The backend saves the uploaded image locally
4. The YOLO model processes the image and detects possible diseases
5. Multiple detections may occur depending on the image
6. The system selects the prediction with the highest confidence score
7. The detected disease is mapped to a predefined advisory
8. The final result is returned as a JSON response

---

## Project Structure

```
drone_orchard_system/
│
├── main.py
│
├── model/
│   └── best.pt
│
├── routes/
│   └── predict_route.py
│
├── services/
│   ├── prediction_service.py
│   └── advisory_service.py
│
├── utils/
│   └── file_handler.py
│
├── static/
│   └── uploads/
│
└── requirements.txt
```

---

## Module Description

### main.py

This file serves as the entry point of the application. It initializes the FastAPI instance and registers all API routes. It is responsible for starting the server.

---

### model/best.pt

This is the trained YOLO model file. It contains the learned weights used for detecting plant diseases from images. This file is essential for performing inference.

---

### routes/predict_route.py

This module defines the API endpoint responsible for handling image upload requests. It connects the user input with backend services and returns the final response.

---

### services/prediction_service.py

This module contains the core logic for running the YOLO model. It loads the model, processes the image, and extracts prediction details such as class labels and confidence scores.

---

### services/advisory_service.py

This module maps detected diseases to appropriate advisory recommendations. It provides guidance on possible treatments or actions for each disease.

---

### utils/file_handler.py

This module handles file operations, specifically saving uploaded images to a designated directory on the server.

---

### static/uploads/

This directory stores images uploaded by users during prediction. It acts as temporary storage for processing.

---

## Model Details

The system uses a YOLOv8 model trained for plant disease detection. The model takes an image as input and outputs detected regions along with corresponding class labels and confidence scores.

### Disease Classes

| Class ID | Disease Name   |
| -------- | -------------- |
| 0        | apple_scab     |
| 1        | black_rot      |
| 2        | cedar_rust     |
| 3        | powdery_mildew |
| 4        | healthy        |

The model may detect multiple regions in a single image. To ensure clarity, the system selects the prediction with the highest confidence score.

---

## API Specification

### Endpoint

POST `/predict/`

### Input

* Image file (multipart/form-data)

### Output

```json
{
  "result": {
    "disease": "black_rot",
    "confidence": 0.88,
    "advisory": "Remove infected parts"
  }
}
```

---

## Installation and Setup

### Clone the Repository

```
git clone https://github.com/your-repository-name.git
cd your-repository-name
```

### Install Dependencies

```
pip install -r requirements.txt
```

### Add Model File

Place the trained model file in the following location:

```
model/best.pt
```

---

## Running the Application

Start the FastAPI server using the following command:

```
uvicorn main:app --reload
```

The application will be accessible at:

```
http://127.0.0.1:8000
```

---

## Testing the API

Open the Swagger UI for testing:

```
http://127.0.0.1:8000/docs
```

Upload an image using the `/predict/` endpoint to receive prediction results.

---

## Technologies Used

* Python
* FastAPI
* Ultralytics YOLOv8
* OpenCV

---

## Dataset

The dataset used for training is not included in this repository due to size limitations. It can be accessed through an external link.

Dataset Link: Add your Google Drive or Kaggle dataset link here.

---

## Limitations

* The system does not store prediction history
* No database integration is included
* No deployed frontend is included in this repository
* Accuracy depends on the quality and diversity of the training dataset

---

## Future Enhancements

* Integration of a database for storing prediction history
* Development of a complete frontend interface
* Returning processed images with bounding boxes
* Deployment on cloud platforms for public access

---

## Conclusion

This project demonstrates the application of deep learning techniques in agriculture for automated plant disease detection. By combining a YOLO-based model with a FastAPI backend, the system provides an efficient and scalable solution for identifying plant diseases and suggesting corrective actions. It highlights the potential of AI in improving agricultural productivity and decision-making processes.

---
