from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_session
from app.models.user import User
from app.schemas.auth import UserCreate, UserResponse, Token
from app.services.auth_service import get_password_hash, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, session: Session = Depends(get_session)):
    clean_username = user.username.strip()
    clean_email = user.email.strip().lower()

    statement = select(User).where(func.lower(User.username) == clean_username.lower())
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    statement = select(User).where(func.lower(User.email) == clean_email)
    existing_email = session.exec(statement).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=clean_username,
        email=clean_email,
        hashed_password=hashed_password,
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    identifier = form_data.username.strip().lower()
    statement = select(User).where(
        (func.lower(User.username) == identifier) | (func.lower(User.email) == identifier)
    )
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

from typing import List

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    statement = select(User)
    users = session.exec(statement).all()
    return users
