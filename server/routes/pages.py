"""
    st_innocent/server/routes/pages.py
"""

from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from server.models import Page, Index, Content, PageResponse, JSONException
from server.auth import check_access_token
from server.logger import logger

router = APIRouter(prefix="/pages")


@router.get(
    "",
    responses={
        200: {"model": PageResponse},
        500: {"model": JSONException},
    },
)
async def get_pages(
    _filter: str | None,
    _field: str | None,
    _order: str | None,
    _range: str | None,
    _: Annotated[str, Depends(check_access_token)],
):
    """
    Returns the list of pages
    """

    try:
        pages = []
        page_names = await Content.distinct("page")
        total = len(page_names)

        for _, page in enumerate(page_names):
            content = await Content.find_one(
                Content.page == page, Content.name == "title"
            )
            title = content.data
            pages.append(Page(id=page, title=title))

        # sort
        if _field == "id":
            pages.sort(key=lambda p: p.id, reverse=_order == "DESC")
        elif _field == "title":
            pages.sort(key=lambda p: p.title, reverse=_order == "DESC")

        # get range
        beg, end = eval(_range)
        pages = pages[beg : end + 1]

        return PageResponse(
            **{
                "success": True,
                "detail": f"{total} total page(s), {len(pages)} pages retrieved.",
                "total": total,
                "data": pages,
            }
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e


@router.get(
    "/{name}",
    responses={
        200: {"model": PageResponse},
        404: {"model": JSONException},
        500: {"model": JSONException},
    },
)
async def get_page(name: str):
    """
    Returns a page's content
    """

    contents = await Content.find(Content.page == name).to_list()
    if len(contents) == 0:
        err = f"Page {name} doesn't exist in db."
        logger.error(err)
        raise HTTPException(status_code=404, detail={"detail": err})

    try:
        page_content = {}
        page_content["id"] = name
        for content in contents:
            page_content[content.name] = content.data

        detail = f"Retrieved {name} page's content."
        logger.info(detail)

        return PageResponse(
            success=True,
            detail=detail,
            data=page_content,
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
    "/{name}",
    responses={
        200: {"model": PageResponse},
        404: {"model": JSONException},
        500: {"model": JSONException},
    },
)
async def update_page(
    name: str, page: Index, _: Annotated[str, Depends(check_access_token)]
):
    """
    Update a page
    """

    try:
        for updated_content in page:
            content_name, updated_data = updated_content
            if content_name == "id":
                continue

            content = await Content.find_one(
                Content.page == name, Content.name == content_name
            )
            await content.set({Content.data: updated_data})

        detail = f"Updated {name} page's content."
        logger.info(detail)

        return PageResponse(
            success=True,
            detail=detail,
            data=page,
            total=1,
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e
