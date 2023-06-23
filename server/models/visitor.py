"""
    st_innocent/server/models/visitor.py
"""

from beanie import Document
from pydantic import BaseModel


class VisitorIP(BaseModel):
    ip: str


class VisitorData(BaseModel):
    isp: str
    autonomous_sys: str
    ip_address: str
    city: str
    country_code: str
    latitude: float
    longitude: float
    org: str
    region: str
    region_name: str
    timezone: str
    zip_code: str


class Visitor(Document):
    visits: int
    last_visit: str
    data: VisitorData

    class Settings:
        name = "visitors"


class VisitorOut(Visitor):
    class Config:
        fields = {"id": "id"}

    def __init__(self, **pydict):
        super(VisitorOut, self).__init__(**pydict)
        self.id = pydict.get("id")
