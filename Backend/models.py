from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from database import Base


class OrchardImage(Base):
    __tablename__ = "orchard_images"

    image_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    disease_id = Column(Integer)
    image_filename = Column(String(255))
    image_path = Column(String(255))
    health_classification = Column(String(50))
    confidence_score = Column(Float)


class OrchardHealthHistory(Base):
    __tablename__ = "orchard_health_history"

    history_id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer)
    health_status = Column(String(50))


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50))
    password_hash = Column(String(255))
    email = Column(String(100))
    full_name = Column(String(100))
    role = Column(String(50))
    is_active = Column(Boolean)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)