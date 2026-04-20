import requests

print("Signing up test user...")
res_signup = requests.post("http://127.0.0.1:8000/auth/signup", json={
    "username": "testman",
    "password": "mypassword123",
    "email": "testman@example.com"
})
print("Signup:", res_signup.json())

print("Logging in test user...")
res_login = requests.post("http://127.0.0.1:8000/auth/login", json={
    "username": "testman@example.com",
    "password": "mypassword123"
})
print("Login:", res_login.json())
