from passlib.context import CryptContext
from routes.auth_route import verify_password
import sys

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hash_val = "$2b$12$xmpWeEtGK44zpeaViq2RN.XDyCcSQE0fE9u2lYNpFiuL4B54hcg8q"

print("Direct verify ayush:", pwd_context.verify("ayush", hash_val))
print("Direct verify same as signup:", pwd_context.verify("same as signup", hash_val))
print("Direct verify ayush@gmail.com:", pwd_context.verify("ayush@gmail.com", hash_val))
print("Direct verify test1234:", pwd_context.verify("test1234", hash_val))
print("Using verify_password 'ayush':", verify_password("ayush", hash_val))

