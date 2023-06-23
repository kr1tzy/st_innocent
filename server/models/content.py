"""
    st_innocent/server/models/content.py
"""

from beanie import Document


class Content(Document):
    page: str
    name: str
    data: list | str

    class Settings:
        name = "content"


class ContentOut(Content):
    class Config:
        fields = {"id": "id"}

    def __init__(self, **pydict):
        super(ContentOut, self).__init__(**pydict)
        self.id = pydict.get("id")
