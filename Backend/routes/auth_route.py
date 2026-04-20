from fastapi import APIRouter
from database import SessionLocal
from models import User
from pydantic import BaseModel
from passlib.context import CryptContext

router = APIRouter()

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Helper functions
def hash_password(password: str):
    password = password.strip()[:72]   # limit bcrypt length
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    plain = plain.strip()[:72]
    return pwd_context.verify(plain, hashed)


# Request models
class SignupRequest(BaseModel):
    username: str
    password: str
    email: str

class LoginRequest(BaseModel):
    username: str   # frontend is sending email here
    password: str


#  SIGNUP
@router.post("/signup")
def signup(data: SignupRequest):
    db = SessionLocal()

    username = data.username.strip().lower()
    password = data.password.strip()
    email = data.email.strip().lower()

    # check existing user (username OR email)
    existing_user = db.query(User).filter(
        (User.username == username) | (User.email == email)
    ).first()

    if existing_user:
        db.close()
        return {"message": "User already exists"}

    hashed_password = hash_password(password)

    new_user = User(
        username=username,
        password_hash=hashed_password,
        email=email,
        full_name=username,
        role="Farmer",
        is_active=1
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    user_id = new_user.user_id
    db.close()

    return {"message": "User registered successfully", "user_id": user_id}


#  LOGIN (FINAL FIX)
@router.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()

    email = data.username.strip().lower()
    password = data.password.strip()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        db.close()
        return {"message": "Invalid email or password"}

    # handles both old (plain) and new (hashed) passwords
    if password == user.password_hash or verify_password(password, user.password_hash):
        user_id = user.user_id
        db.close()
        return {"message": "Login successful", "user_id": user_id}
    else:
        db.close()
        return {"message": "Invalid email or password"}