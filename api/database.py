"""
    st_innocent/api/database.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from api.config import settings
from api.logger import logger

mongo = None
db = None
fs = None


async def connect_to_mongo():
    """
    Connection event handler
    """
    global mongo, db, fs

    if mongo is None or db is None or fs is None:
        mongo = AsyncIOMotorClient(settings.mongo_url)
        mongo.get_io_loop = asyncio.get_event_loop
        db = mongo.get_default_database()
        fs = AsyncIOMotorGridFSBucket(db)

    return db, fs


logger.info("Database & GridFS initialized")
