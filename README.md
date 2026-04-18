# Drone Apple Orchard Management System
A full-stack AI-powered system for monitoring apple orchards using drone imagery and deep learning.  
This project detects diseases in apple trees and provides actionable insights to improve orchard health and productivity.


##  Overview
The system uses a YOLOv8 deep learning model to analyze images captured by drones and identify common apple diseases.  
It also maintains a history of predictions for tracking orchard health over time.


##  Features
-  **User Authentication**
  - Secure signup and login system

-  **AI-Based Disease Detection**
  - Detects:
    - Apple Scab
    - Black Rot
    - Cedar Apple Rust
    - Powdery Mildew
    - Healthy leaves

-  **Advisory System**
  - Provides suggestions and treatment recommendations based on detected disease

-  **History Tracking**
  - Stores prediction results in a MySQL database

-  **Image Upload**
  - Users can upload leaf/drone images for analysis


## Setup Instructions

### 1. Database Configuration
You need a MySQL database running on your local machine.

1. Ensure MySQL is running on port 3306.
2. Create a database named `apple_orchard_db`.
3. If necessary, adjust the `DATABASE_URL` in `Backend/database.py` with your MySQL credentials, e.g., `mysql+pymysql://root:password@127.0.0.1:3306/apple_orchard_db`.
4. Create the required tables in your database according to the `models.py` schema schema (you can write a short synchronization script calling `Base.metadata.create_all(bind=engine)` from `database.py`).

### 2. Backend Setup
1. Open your terminal and navigate to the project root directory.
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will run at `http://127.0.0.1:8000`. You can test your endpoints by visiting `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
1. The frontend consists of static files (HTML, CSS, JS).
2. You can open any HTML file, like `frontend/index.html` or `frontend/login.html` directly in your web browser.
3. *Alternative:* To avoid CORS/fetch errors, you can serve the frontend folder via a local server:
   ```bash
   cd frontend
   python -m http.server 5500
   ```
   And visit `http://127.0.0.1:5500` in your browser.


##  Tech Stack
| Layer        | Technology Used |
|-------------|----------------|
| Model       | YOLOv8 (Ultralytics) |
| Backend     | FastAPI |
| Database    | MySQL + SQLAlchemy |
| Frontend    | HTML, CSS, JavaScript |


## Project strucutre 
a:\Drone Apple Orchard Management System
|
+--- README.md
|
+--- Backend\
|   |--- database.py
|   |--- main.py
|   |--- models.py
|   |--- requirements.txt
|   |
|   +--- model\
|   |       best.pt
|   |
|   +--- routes\
|   |       auth_route.py
|   |       predict_route.py
|   |
|   +--- services\
|   |       advisory_service.py
|   |       prediction_service.py
|   |
|   +--- static\
|   |   \--- uploads\
|   |           blackrot_080.jpg
|   |           rust_007.jpg
|   |           (and 16 other uploaded sample JPGs)
|   |
|   +--- test\
|   |       test_model.py
|   |       test_api.py 
|   |       test_local.py
|   |       test_verify.py
|   |
|   \--- utils\
|           file_handler.py
|
+--- frontend\
|   |--- dashboard.html
|   |--- index.html
|   |--- login.html
|   |--- result.html
|   |--- signup.html
|   |--- upload.html
|   |
|   +--- assets\
|   |   +--- icons\
|   |   \--- images\
|   |           orchard-bg.webp
|   |
|   +--- css\
|   |       style.css
|   |
|   \--- js\
|           app.js
|
+--- scripts\
|       fix_labels.py
|       split_dataset.py
|
\--- dataset\
    +--- train\
    |   +--- images\  (thousands of .jpg files)
    |   \--- labels\  (thousands of .txt YOLO label files)
    |
    +--- test\
    |   +--- images\
    |   \--- labels\
    |
    \--- validation\
        +--- images\
        \--- labels\
