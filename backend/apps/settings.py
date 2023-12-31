from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base
import os

engine = create_engine(os.environ.get("DATABASE_URI"))
SECRET_KEY = os.environ.get("SECRET_KEY")

db_session = scoped_session(sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine)
)

Base = declarative_base()
Base.query = db_session.query_property()
Base.engine = engine

def init_db():
    from apps.models import User
    Base.metadata.create_all(bind=engine)