"""
    st_innocent/scripts/snapshot.py
"""

import os, asyncio, aiofiles, aiofiles.os, json
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from beanie.operators import In
from api.database import connect_to_mongo
from api.models import File, Content
from bson import ObjectId
import sys


async def gridfs_to_disk(fs, images: list[File], images_dir: str):
    """
    Images from gridfs to snapshot directory
    """
    saved_idx = 0
    for image in images:
        gridfs_image = await fs.open_download_stream(ObjectId(image.gridfs_id))
        image_bytes = await gridfs_image.read()
        image_path = f"{images_dir}/{image.name}"
        if not await aiofiles.os.path.exists(image_path):
            async with aiofiles.open(image_path, mode="wb") as f:
                await f.write(image_bytes)
                print(f"saved {image.name} ({image.size}) in {images_dir}")
                saved_idx += 1
        else:
            print(f"{image.name} ({image.size}) already saved")

    print(f"{saved_idx} saved in {images_dir}")



async def main():
    db, fs = await connect_to_mongo()
    await init_beanie(
        database=db,
        document_models=[File, Content],
    )

    snapshot_dir = input("directory to save snapshot: ")
    if await aiofiles.os.path.exists(snapshot_dir):
        print(f"directory '{snapshot_dir}' already exists, exiting")
        sys.exit(1)

    # setup snapshot directory
    images_dir = f"{snapshot_dir}/images"
    content_dir = f"{snapshot_dir}/content"
    await aiofiles.os.makedirs(snapshot_dir)
    await aiofiles.os.makedirs(content_dir)
    await aiofiles.os.makedirs(images_dir)

    # save images
    images = await File.find(
        In(File.content_type, ["image/jpeg", "image/png", "image/svg+xml"])
    ).to_list()
    print(len(images), "images found in db")
    await gridfs_to_disk(fs, images, images_dir)
    
    # save content
    page_names = await Content.distinct("page")
    for page in page_names:
        page_data = {}
        contents = await Content.find(Content.page == page).to_list()
        for content in contents:  # gather all the page content
            page_data[content.name] = content.data
        page_json_path = f"{content_dir}/{page}.json"
        with open(page_json_path, "w") as f:
            json.dump(page_data, f, indent=2)
        print(f"dumped {len(page_data.keys())} contents into: {page_json_path}")


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
