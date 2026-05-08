from routes.auth_route import signup, login, SignupRequest, LoginRequest
from models import User
from database import SessionLocal

print("Cleaning up old testman...")
db = SessionLocal()
db.query(User).filter(User.username == "testman").delete()
db.commit()

print("Signing up test user...")
req1 = SignupRequest(username="testman", password="mypassword123", email="testman@example.com")
print(signup(req1))

print("Logging in test user...")
req2 = LoginRequest(username="testman@example.com", password="mypassword123")
print(login(req2))

print("Fetching testman hashed pass...")
u = db.query(User).filter(User.username == "testman").first()
print("Hash:", u.password_hash)

db.close()
