"""
    st_innocent/api/models/file.py
"""


from beanie import Document


class File(Document):
    """
    File model
    """

    name: str
    content_type: str
    gridfs_id: str
    size: str
    admin_url: str

    class Settings:
        name = "files"
