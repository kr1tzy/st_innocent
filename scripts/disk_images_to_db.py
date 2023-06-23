"""
    st_innocent/scripts/disk_images_to_db.py
"""

import asyncio, aiofiles, aiofiles.os
from beanie import Document, init_beanie
from server.models import File
from server.helpers import HumanBytes
from server.database import connect_to_mongo
from server.config import settings
from mimetypes import guess_type


async def disk_to_gridfs(fs, images_dir: str):
    saved_idx = 0
    image_names = await aiofiles.os.listdir(images_dir)
    print(len(image_names), f"images found in {images_dir}")
    for name in image_names:
        image_path = f"{images_dir}/{name}"

        # Read the image bytes
        async with aiofiles.open(image_path, mode="rb") as f:
            image_bytes = await f.read()

        if await File.find_one(File.name == name):
            print(f"{name} already saved in db")
            continue

        # Store the image in GridFS
        gridfs_id = await fs.upload_from_stream(name, image_bytes)

        print(f"stored {name} in gridfs ({gridfs_id})")

        # Create a new beanie document
        file = File(
            name=name,
            gridfs_id=str(gridfs_id),
            content_type=guess_type(image_path)[0],
            size=HumanBytes.format(len(image_bytes), True),
            admin_url="",
        )

        await file.insert()

        await file.set(
            {
                File.admin_url: f"http://{settings.host}:{settings.server_port}/images/{file.id}?raw=true"
                if settings.mode == "dev"
                else f"https://admin.{settings.host}/api/images/{file.id}?raw=true"
            }
        )

        print(f"saved {name} (file.size) in db")
        saved_idx += 1

    print(f"{saved_idx} saved in db")


async def main():
    db, fs = await connect_to_mongo()
    await init_beanie(
        database=db,
        document_models=[File],
    )

    images_dir = input("directory of images: ")
    if not await aiofiles.os.path.exists(images_dir):
        print(f"directory '{images_dir}' does not exist")
        exit(1)

    await disk_to_gridfs(fs, images_dir)
    files = await File.find().to_list()


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
