from fastapi import APIRouter
from database import SessionLocal
from models import User
from pydantic import BaseModel

router = APIRouter()

# ✅ Request model (for POST)
class SignupRequest(BaseModel):
    username: str
    password: str
    email: str

class LoginRequest(BaseModel):
    username: str
    password: str


# ✅ SIGNUP (POST - correct way)
@router.post("/signup")
def signup(data: SignupRequest):
    db = SessionLocal()

    print("SIGNUP API HIT")

    new_user = User(
        username=data.username,
        password_hash=data.password,
        email=data.email,
        full_name=data.username,
        role="Farmer",
        is_active=1
    )

    db.add(new_user)
    db.commit()
    db.close()

    return {"message": "User saved in DB"}


# ✅ LOGIN (POST - clean)
@router.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()

    user = db.query(User).filter(User.username == data.username).first()

    if user and user.password_hash == data.password:
        return {"message": "Login successful"}
    else:
        return {"message": "Invalid credentials"}