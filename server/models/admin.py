"""
    st_innocent/server/models/admin.py
"""

from beanie import Document


class Admin(Document):
    username: str
    name: str
    email: str
    hashed_password: str
    pushover_token: str
    notifications: bool

    class Settings:
        name = "admins"
