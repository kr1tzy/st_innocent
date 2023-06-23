"""
    st_innocent/scripts/snapshot.py
"""

import os, asyncio, aiofiles, aiofiles.os, json
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from server.models.content import Content
from server.config import settings


async def main():
    mongo = AsyncIOMotorClient(settings.mongo_url)
    await init_beanie(database=mongo.get_default_database(), document_models=[Content])

    page_jsons_dir = input("directory to save jsons: ")
    if not await aiofiles.os.path.exists(page_jsons_dir):
        print(f"directory '{page_jsons_dir}' does not exist, creating")
        await aiofiles.os.makedirs(page_jsons_dir)

    page_names = await Content.distinct("page")
    for page in page_names:
        page_data = {}
        contents = await Content.find(Content.page == page).to_list()
        for content in contents:  # gather all the page content
            page_data[content.name] = content.data
        page_json_path = f"{page_jsons_dir}/{page}.json"
        with open(page_json_path, "w") as f:
            json.dump(page_data, f, indent=2)
        print(f"dumped {len(page_data.keys())} contents into: {page_json_path}")


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
