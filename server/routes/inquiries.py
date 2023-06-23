"""
    st_innocent/server/routes/inquiries.py
"""

import requests
from dateutil import parser
from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from server.models import (
    Admin,
    InquiryData,
    Inquiry,
    Response,
    InquiryResponse,
    JSONException,
)
from server.validators.inquiry import validate_inquiry_data
from server.auth import check_access_token
from server.config import settings
from server.logger import logger

router = APIRouter(prefix="/inquiries")


@router.get(
    "",
    responses={
        200: {"model": InquiryResponse},
        500: {"model": JSONException},
    },
)
async def get_inquiries(_: Annotated[str, Depends(check_access_token)]):
    """
    Get all inquiries
    """

    try:
        inquiries = await Inquiry.find({}).to_list()
        return InquiryResponse(
            success=True,
            detail=f"{len(inquiries)} inquiries",
            total=len(inquiries),
            data=inquiries,
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e


@router.post(
    "/new",
    responses={
        200: {"model": Response},
        500: {"model": JSONException},
    },
)
async def new_inquiry(data: InquiryData):
    """
    Handles new inquiries
    """

    try:
        now = datetime.now().isoformat()
        dt = parser.isoparse(now)
        when = dt.strftime("%m/%d/%Y @ %I:%M:%S %p")
        success, errors = validate_inquiry_data(data)
        detail = "Received! We'll reach out soon." if success else "Validation errors!"

        if success:
            inquiry = Inquiry(when=when, data=data, followed_up=False)
            await inquiry.insert()

            logger.debug(f"created: {inquiry}")

            message = "New inquiry!\n\n"
            message += f"Name: {data.name}\n"
            message += f"Email: {data.email}\n"
            message += f"Phone: {data.phone}\n"
            message += f"Msg: {data.message}\n"

            admins = await Admin.find(Admin.notifications == True).to_list()
            for admin in admins:
                payload = {
                    "user": admin.pushover_token,
                    "token": settings.pushover_api_token,
                    "message": message,
                }

                requests.post(
                    "https://api.pushover.net/1/messages.json",
                    headers={"User-Agent": "Python"},
                    data=payload,
                    timeout=5,
                )

        return Response(
            **{
                "success": success,
                "detail": detail,
                "total": len(errors),
                "data": errors,
            }
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e


@router.put(
    "/done",
    responses={
        200: {"model": InquiryResponse},
        500: {"model": JSONException},
    },
)
async def followed_up(inquiry_id: str, _: Annotated[str, Depends(check_access_token)]):
    """
    Handles when an inquiry is followed up on
    """

    try:
        inquiry = await Inquiry.get(inquiry_id)
        await inquiry.set({Inquiry.followed_up: True})

        logger.debug(f"updated: {inquiry}")

        return InquiryResponse(
            **{
                "success": True,
                "detail": f"Inquiry updated.",
                "data": inquiry,
                "total": 1,
            }
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e
