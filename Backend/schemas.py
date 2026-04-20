from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    user_id: int
    feedback_type: str
    feedback_content: str

class FeedbackResponse(BaseModel):
    feedback_id: int
    user_id: int
    feedback_type: str
    feedback_content: str
    timestamp: datetime
    
    class Config:
        from_attributes = True
