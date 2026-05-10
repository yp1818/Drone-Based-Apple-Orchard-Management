from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#  CHANGE PASSWORD
DATABASE_URL = "mysql://root:wQqAwoVEaZZTervzIMtOhAWeUcWJApMZ@junction.proxy.rlwy.net:54517/railway"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
