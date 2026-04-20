from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Feedback
from schemas import FeedbackCreate

router = APIRouter()

@router.post("/")
async def create_feedback(feedback_data: FeedbackCreate, db: Session = Depends(get_db)):
    print("FEEDBACK ROUTE HIT")
    new_feedback = Feedback(
        user_id=feedback_data.user_id,
        feedback_type=feedback_data.feedback_type,
        feedback_content=feedback_data.feedback_content
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return {"message": "Feedback submitted successfully"}
