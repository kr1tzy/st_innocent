"""
    st_innocent/server/routes/content.py
"""

from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from server.models import Content, ContentResponse, JSONException
from server.auth import check_access_token
from server.logger import logger

router = APIRouter(prefix="/content")


@router.get(
    "",
    responses={
        200: {"model": ContentResponse},
        500: {"model": JSONException},
    },
    response_model_by_alias=False,
)
async def list_content(_: Annotated[str, Depends(check_access_token)]):
    """
    Returns a list of all content
    """
    try:
        contents = await Content.find().to_list()
        return ContentResponse(
            success=True,
            detail=f"{len(contents)} contents",
            total=len(contents),
            data=contents,
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e


@router.get(
    "/{id}",
    responses={
        200: {"model": ContentResponse},
        404: {"model": JSONException},
        500: {"model": JSONException},
    },
)
async def get_content(id: str, _: Annotated[str, Depends(check_access_token)]):
    """
    Returns content
    """

    content = await Content.get(id)

    if content is None:
        err = f"Content doesn't exist: {id}"
        logger.error(err)
        raise HTTPException(status_code=404, detail={"detail": err})

    try:
        return ContentResponse(
            success=True,
            detail=f"Content ({id}) retrieved.",
            data=content,
            total=1,
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e


@router.put(
    "/{id}",
    responses={
        200: {"model": ContentResponse},
        404: {"model": JSONException},
        500: {"model": JSONException},
    },
)
async def update_content(
    id: str, updated: Content, _: Annotated[str, Depends(check_access_token)]
):
    """
    Update content
    """
    content = await Content.get(id)

    if content is None:
        err = f"Content doesn't exist: {id}"
        logger.error(err)
        raise HTTPException(status_code=404, detail={"detail": err})

    try:
        await content.set({Content.data: updated.data})
        return ContentResponse(
            success=True,
            detail=f"Content ({id}) updated.",
            data=content,
            total=1,
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e
