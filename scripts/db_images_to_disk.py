"""
    st_innocent/scripts/db_images_to_disk.py
"""

import asyncio, aiofiles, aiofiles.os
from beanie import init_beanie
from beanie.operators import In
from server.models import File
from server.database import connect_to_mongo
from server.config import settings
from bson import ObjectId


async def gridfs_to_disk(fs, images: list[File], images_dir: str):
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
        document_models=[File],
    )

    images_dir = input("directory to save images: ")
    if not await aiofiles.os.path.exists(images_dir):
        print(f"directory '{images_dir}' does not exist, creating")
        await aiofiles.os.makedirs(images_dir)

    images = await File.find(
        In(File.content_type, ["image/jpeg", "image/png", "image/svg+xml"])
    ).to_list()
    print(len(images), "images found in db")
    if len(images) == 0:
        exit(1)
    await gridfs_to_disk(fs, images, images_dir)


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
