"""
    st_innocent/server/models/inquiry.py
"""

from beanie import Document
from pydantic import BaseModel


class InquiryData(BaseModel):
    """
    Data model for an inquiry
    """

    name: str
    email: str | None
    phone: str | None
    message: str | None


class Inquiry(Document):
    when: str
    data: InquiryData
    followed_up: bool

    class Settings:
        name = "inquiries"


class InquiryOut(Inquiry):
    class Config:
        fields = {"id": "id"}

    def __init__(self, **pydict):
        super(InquiryOut, self).__init__(**pydict)
        self.id = pydict.get("id")
