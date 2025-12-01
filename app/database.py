# app/database.py
from sqlmodel import create_engine, SQLModel, Session
from typing import Generator

sqlite_file_name = "users.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# check_same_thread False is required for SQLite usage with multiple threads in dev
engine = create_engine(sqlite_url, echo=False, connect_args={"check_same_thread": False})

def init_db() -> None:
    from .models import User  # import models so SQLModel.metadata sees them
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
