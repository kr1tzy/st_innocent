"""
    st_innocent/scripts/restore_snapshot.py
"""

import os, asyncio, aiofiles, aiofiles.os, json
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from server.models.content import Content
from server.config import settings


async def main():
    mongo = AsyncIOMotorClient(settings.mongo_url)
    await init_beanie(database=mongo.get_default_database(), document_models=[Content])

    page_jsons_dir = input("directory of page jsons: ")
    if not await aiofiles.os.path.exists(page_jsons_dir):
        print(f"directory '{page_jsons_dir}' does not exist")
        exit(1)

    page_jsons = await aiofiles.os.listdir(page_jsons_dir)
    for page_json in page_jsons:
        print(page_json)
        page = page_json.replace(".json", "")
        page_json_path = f"{page_jsons_dir}/{page_json}"
        with open(page_json_path, "r") as f:
            data = json.load(f)

        for name in list(data.keys()):
            value = data.get(name)
            content = await Content.find_one(Content.page == page, Content.name == name)
            if content is None:
                content = Content(name=name, page=page, data=value)
                await content.insert()
                print(f"- created: {content}")
            else:
                if content.data == value:
                    print(f"- already saved: {content.name}")
                else:
                    await content.set({Content.data: value})
                    print(f"- updated: {content.name}")


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
