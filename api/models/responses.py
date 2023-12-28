"""
    st_innocent/api/models/responses.py
"""

from pydantic import BaseModel

from .pages import Page, Index
from .content import Content
from .visitor import Visitor
from .inquiry import Inquiry
from .file import File


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

    data: Content | list[Content] | None


class FileResponse(Response):
    """
    File response model
    """

    data: File | list[File] | None


class AnalyticsResponse(Response):
    """
    Analytics response model
    """

    data: Visitor | list[Visitor] | None


class InquiryResponse(Response):
    """
    Inquiry response model
    """

    data: Inquiry | list[Inquiry] | None


class JSONException(BaseModel):
    """
    HTTP exception model (override)
    """

    status_code: int
    content: Response
