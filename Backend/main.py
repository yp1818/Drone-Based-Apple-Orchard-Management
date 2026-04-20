from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles   
from routes.predict_route import router as predict_router
from routes.auth_route import router as auth_router
from routes.dashboard_route import router as dashboard_router
from routes.feedback_route import router as feedback_router
from database import engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(predict_router, prefix="/predict")

app.include_router(auth_router, prefix="/auth")

app.include_router(dashboard_router)
app.include_router(feedback_router, prefix="/feedback")

@app.get("/")
def home():
    return {"status": "API running"}

@app.get("/test-db")
def test_db_insert():
    from database import SessionLocal
    from models import Feedback
    import traceback
    try:
        db = SessionLocal()
        test_fb = Feedback(user_id=999, message="Test insert works!")
        db.add(test_fb)
        db.commit()
        db.close()
        return {"status": "DB Insert Successful"}
    except Exception as e:
        traceback.print_exc()
        return {"status": "DB Insert Failed", "error": str(e)}