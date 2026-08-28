from datetime import datetime, timedelta, timezone
import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security.utils import get_authorization_scheme_param
from fastapi.security import OAuth2PasswordBearer
from app.limiter import limiter
import jwt as pyjwt_lib      # we will use pyjwt since it is standard
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# A static, valid bcrypt hash of "dummy_password" used to equalize response times
DUMMY_HASH = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "trackrai-super-secret-development-key-123456")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # 24 hours

# Fail-Closed Cryptographic Bootloader Lock
if SECRET_KEY == "trackrai-super-secret-development-key-123456" and os.getenv("ENVIRONMENT") != "development":
    raise RuntimeError("CRITICAL SECURITY FAILURE: Attempting to boot using the public, hardcoded development SECRET_KEY. You must configure SECRET_KEY in your environment variables to prevent database decryption and JWT forgery. Boot aborted (unless ENVIRONMENT=development).")

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ─── Auth Helper Functions ─────────────────────────────────────────

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    # pyjwt_lib encode
    encoded_jwt = pyjwt_lib.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Prioritize Authorization header to override any stale/invalid cookies
    token = None
    authorization = request.headers.get("Authorization")
    if authorization:
        scheme, param = get_authorization_scheme_param(authorization)
        if scheme.lower() == "bearer":
            token = param

    # Fallback to cookie if no valid Bearer token was provided
    if not token:
        token = request.cookies.get("access_token")
        
    if not token:
        raise credentials_exception

    # Standard JWT Validation
    try:
        payload = pyjwt_lib.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        session_version = payload.get("version")
        if user_id_str is None or session_version is None:
            raise credentials_exception
        user_id = int(user_id_str)
    except Exception:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None or user.session_version != session_version:
        raise credentials_exception
    return user


# ─── Routes ────────────────────────────────────────────────────────

@router.post("/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def signup(request: Request, user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        # Mitigate User Enumeration Timing Attack
        verify_password(user_in.password, DUMMY_HASH)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_pw = get_password_hash(user_in.password)
    
    # Auto-grant premium to admin accounts
    is_admin_premium = user_in.email in ["rajdeeppalwork@gmail.com"]
    
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_pw,
        is_premium=is_admin_premium,
    )
    
    if is_admin_premium:
        # Give lifetime premium (or far in the future)
        new_user.premium_expires_at = datetime.utcnow() + timedelta(days=36500)
        
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=schemas.Token)
@limiter.limit("10/minute")
def login(request: Request, response: Response, user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    
    # Timing Attack Prevention: Always compute a hash regardless of whether the user exists
    if not user:
        verify_password(user_in.password, DUMMY_HASH)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "version": user.session_version},
        expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(response: Response, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Increment session_version to globally invalidate all existing JWTs for this user
    current_user.session_version += 1
    db.commit()
    response.delete_cookie("access_token", httponly=True, secure=True, samesite="lax")
    return {"message": "Successfully logged out. All existing sessions have been terminated."}


@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.get("/resume", response_model=schemas.ResumeResponse)
def get_resume(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.put("/resume", response_model=schemas.ResumeResponse)
def update_resume(
    resume_in: schemas.ResumeUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    current_user.resume_text = resume_in.resume_text
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/profile", response_model=schemas.UserProfileResponse)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return {
        "current_position": current_user.current_position,
        "current_company": current_user.current_company,
        "bio": current_user.bio,
        "gmail_connected": current_user.google_refresh_token is not None,
        "gmail_sync_enabled": current_user.gmail_sync_enabled,
        "last_gmail_sync": current_user.last_gmail_sync,
        "is_premium": current_user.is_premium,
        "gmail_scans_used": current_user.gmail_scans_used
    }


@router.put("/profile", response_model=schemas.UserProfileResponse)
def update_profile(
    profile_in: schemas.UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if profile_in.current_position is not None:
        current_user.current_position = profile_in.current_position
    if profile_in.current_company is not None:
        current_user.current_company = profile_in.current_company
    if profile_in.bio is not None:
        current_user.bio = profile_in.bio
    db.commit()
    db.refresh(current_user)
    return current_user



