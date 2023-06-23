"""
    st_innocent/server/models/file.py
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


class FileOut(File):
    class Config:
        fields = {"id": "id"}

    def __init__(self, **pydict):
        super(FileOut, self).__init__(**pydict)
        self.id = pydict.get("id")
