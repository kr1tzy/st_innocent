"""
    st_innocent/server/models/responses.py
"""

from pydantic import BaseModel

from .pages import Page, Index
from .content import ContentOut
from .visitor import VisitorOut
from .inquiry import InquiryOut
from .file import FileOut


class Response(BaseModel):
    """
    Base response model
    """

    success: bool
    detail: str
    data: dict | list | str | None
    total: int


class PageResponse(Response):
    """
    Page response model
    """

    data: Index | Page | list[Page] | None


class ContentResponse(Response):
    """
    Content response model
    """

    data: ContentOut | list[ContentOut] | None


class FileResponse(Response):
    """
    File response model
    """

    data: FileOut | list[FileOut] | None


class AnalyticsResponse(Response):
    """
    Analytics response model
    """

    data: VisitorOut | list[VisitorOut] | None


class InquiryResponse(Response):
    """
    Inquiry response model
    """

    data: InquiryOut | list[InquiryOut] | None


class JSONException(BaseModel):
    """
    HTTP exception model (override)
    """

    status_code: int
    content: Response
