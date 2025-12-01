from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlmodel import Session, select
from passlib.context import CryptContext
from .database import engine, init_db, get_session
from .models import User, UserCreate, LoginRequest, UserRead
from .uipath import run_uipath,run_add_to_calendar
from fastapi import Body, HTTPException
from datetime import datetime


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title="VIT Campus Alerts Backend")

# Initialize DB (create users.db and tables if not present)
init_db()



# ---- API endpoints ----

@app.post("/api/signup")
def signup(payload: UserCreate):

    with Session(engine) as session:
        # Check username uniqueness
        existing = session.exec(select(User).where(User.username == payload.username)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")

        # Hash the password
        pw_hash = pwd_context.hash(payload.password)

        user = User(
            fullname=payload.fullname,
            email=payload.email,
            app_password=payload.app_password,
            registration=payload.registration,
            year=payload.year,
            branch=payload.branch,
            school=payload.school,
            cgpa=payload.cgpa,
            username=payload.username,
            tenth_percentage=payload.tenth_percentage,
            twelfth_percentage=payload.twelfth_percentage,
            password_hash=pw_hash
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        return {"message": "User registered successfully"}

@app.post("/api/login")
def login(payload: LoginRequest):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == payload.username)).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not pwd_context.verify(payload.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Return safe user data (no password)
        user_data = {
            "id": user.id,
            "fullname": user.fullname,
            "email": user.email,
            "registration": user.registration,
            "year": user.year,
            "branch": user.branch,
            "school": user.school,
            "cgpa": user.cgpa,
            "username": user.username,
            "user_password": user.password_hash,
            "app_password": user.app_password,
            "tenth_percentage": user.tenth_percentage,
            "twelfth_percentage": user.twelfth_percentage

        }
        return {"message": "Login successful", "user": user_data}

@app.get("/api/users", response_model=list[UserRead])
def list_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return users

@app.get("/api/user/{username}", response_model=UserRead)
def get_user(username: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
# Get user profile (by username)
@app.get("/api/profile/{username}")
def get_profile(username: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

# Update user profile
@app.put("/api/profile/{username}")
def update_profile(username: str, payload: dict = Body(...)):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update fields if present
        for field, value in payload.items():
            if hasattr(user, field) and field != "password": 
                setattr(user, field, value)

        session.add(user)
        session.commit()
        session.refresh(user)
        return {"message": "Profile updated successfully", "user": user}
    
@app.post("/api/run-workflow")
def run_workflow(payload: dict = Body(...)):
    """
    Trigger UiPath workflow with user data.
    Expects JSON with keys exactly matching UiPath IN arguments.
    """
    # Ensure date is valid
    if "in_date" in payload:
        try:
            payload["in_date"] = datetime.fromisoformat(payload["in_date"]).date().isoformat()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid in_date format (use YYYY-MM-DD)")


    import logging, json
    logging.warning(f"Payload to UiPath: {json.dumps(payload, indent=2)}")

    result = run_uipath(payload)

    return result

@app.post("/api/add-to-calendar")
def add_to_calendar_endpoint(payload: dict = Body(...)):
    """
    Trigger UiPath Add-to-Calendar workflow.
    Expects JSON: { "in_summary": "<event text>", "in_mail": "<user email>" }
    """
    from app.uipath import run_add_to_calendar

    if "in_summary" not in payload or "in_mail" not in payload:
        raise HTTPException(status_code=400, detail="Missing required fields 'in_summary' or 'in_mail'")

    result = run_add_to_calendar(payload)
    return result



app.mount("/", StaticFiles(directory="static", html=True), name="static")