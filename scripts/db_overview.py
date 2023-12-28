"""
    st_innocent/scripts/db_overview.py
"""

import asyncio
from beanie import init_beanie
from api.models import Admin, Content, File, Inquiry, Visitor
from api.database import connect_to_mongo
from api.logger import logger


async def main():
    db, _ = await connect_to_mongo()
    await init_beanie(
        database=db,
        document_models=[Admin, Content, File, Visitor, Inquiry],
    )

    admins = await Admin.find().to_list()
    logger.info(f"{len(admins)} admins")

    contents = await Content.find().to_list()
    logger.info(f"{len(contents)} contents")

    files = await File.find().to_list()
    logger.info(f"{len(files)} files")

    visitors = await Visitor.find().to_list()
    logger.info(f"{len(visitors)} visitors")

    inquiries = await Inquiry.find().to_list()
    logger.info(f"{len(inquiries)} inquiries")


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
