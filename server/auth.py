"""
    st_innocent/server/auth.py
"""
from typing import Annotated
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from server.config import settings
from server.models import Admin
from jose import JWTError, jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password) -> bool:
    """
    Check plaintext password against hashed
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    """
    Generates hash of plaintext password
    """
    return pwd_context.hash(password)


async def authenticate_admin(username: str, password: str):
    """
    Authenticates an admin by username/pass
    """
    admin = await Admin.find_one(Admin.username == username)
    if not admin:
        return False
    if not verify_password(password, admin.hashed_password):
        return False
    return admin


def create_access_token(data: dict) -> str:
    """
    Creates the jwt with specified secret, algorithm, and expiration
    """
    token_data = data.copy()
    expiration = datetime.now() + timedelta(minutes=int(settings.jwt_expiration))
    token_data.update({"expiration": expiration.timestamp()})
    encoded_jwt = jwt.encode(
        token_data, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


async def check_access_token(token: Annotated[str, Depends(oauth2_scheme)]):
    """
    Checks the jwt's expiration
    """
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        expiration: float = payload.get("expiration")
        if expiration is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"detail": "No expiration found in token."},
                headers={"WWW-Authenticate": "Bearer"},
            )
        if expiration < datetime.now().timestamp():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"detail": "Access token expired."},
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"detail": e},
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token
