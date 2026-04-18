from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles   
from routes.predict_route import router as predict_router
from routes.auth_route import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(predict_router, prefix="/predict")

app.include_router(auth_router, prefix="/auth")

@app.get("/")
def home():
    return {"status": "API running"}