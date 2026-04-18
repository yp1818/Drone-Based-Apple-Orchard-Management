from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#  CHANGE PASSWORD
DATABASE_URL = "mysql+pymysql://root:root@127.0.0.1:3306/apple_orchard_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()