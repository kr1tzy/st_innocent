"""
    st_innocent/api/routes/token.py
"""

from typing import Annotated
from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from api.models import Token, JSONException
from api.logger import logger
from api.auth import authenticate_admin, create_access_token, check_access_token

router = APIRouter(prefix="/token")


@router.post(
    "",
    responses={
        200: {"model": Token},
        401: {"model": JSONException},
        500: {"model": JSONException},
    },
)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """
    Returns a token on a valid login
    """

    admin = await authenticate_admin(form_data.username, form_data.password)
    if not admin:
        err = "Incorrect username or password."
        logger.error(err)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"detail": err},
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={
            "username": admin.username,
        }
    )
    logger.debug(f"{admin.username}'s token: {access_token}")
    return Token(
        **{
            "token_type": "bearer",
            "access_token": access_token,
            "username": admin.username,
        }
    )


@router.get(
    "/check",
    responses={
        200: {"model": Token},
    },
)
async def check_token_expiration(token: Annotated[str, Depends(check_access_token)]):
    """
    Returns the token if it's not expired
    """
    logger.debug("checked access token")
    return token
