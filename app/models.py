from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fullname: str = Field(sa_column=Column(String, nullable=False))
    email: str = Field(sa_column=Column(String, nullable=False))
    app_password: str = Field(sa_column=Column(String, nullable=False))
    tenth_percentage: Optional[str] = Field(sa_column=Column(String, nullable=True))
    twelfth_percentage: Optional[str] = Field(sa_column=Column(String, nullable=True))
    registration: str = Field(sa_column=Column(String, nullable=False))
    year: str = Field(sa_column=Column(String, nullable=False))
    branch: str = Field(sa_column=Column(String, nullable=False))
    school: str = Field(sa_column=Column(String, nullable=False))
    cgpa: Optional[str] = Field(sa_column=Column(String, nullable=True))

    username: str = Field(sa_column=Column(String, unique=True, index=True, nullable=False))
    password_hash: str = Field(sa_column=Column(String, nullable=False))


# Input DTOs (use for request validation)
from sqlmodel import SQLModel

class UserCreate(SQLModel):
    fullname: str
    email: str
    app_password: str
    registration: str
    year: str
    branch: str
    school: str
    cgpa: Optional[str] = None
    username: str
    password: str
    tenth_percentage: Optional[str] = None
    twelfth_percentage: Optional[str] = None

class LoginRequest(SQLModel):
    username: str
    password: str

# Response model (expose publicly, without password_hash)
class UserRead(SQLModel):
    id: int
    fullname: str
    email: str
    registration: str
    year: str
    branch: str
    school: str
    cgpa: Optional[str] = None
    username: str
    tenth_percentage: Optional[str] = None
    twelfth_percentage: Optional[str] = None
