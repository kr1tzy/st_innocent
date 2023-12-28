"""
    st_innocent/api/models/content.py
"""

from beanie import Document


class Content(Document):
    page: str
    name: str
    data: list | str

    class Settings:
        name = "content"
