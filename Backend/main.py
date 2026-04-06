from fastapi import FastAPI
from routes.predict_route import router as predict_router

app = FastAPI()

app.include_router(predict_router, prefix="/predict")

@app.get("/")
def home():
    return {"status": "API running"}