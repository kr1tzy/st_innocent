"""
    st_innocent/scripts/restore_snapshot.py
"""

import os, asyncio, aiofiles, aiofiles.os, json, sys
from beanie import init_beanie
from api.config import settings
from api.helpers import HumanBytes
from api.database import connect_to_mongo
from api.models import File, Content
from mimetypes import guess_type
from bson import ObjectId


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
                File.admin_url: f"http://{settings.host}:{settings.api_port}/images/{file.id}?raw=true"
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
        document_models=[Content, File],
    )

    # check the snapshot directory
    snapshot_dir = input("directory to restore snapshot from: ")
    content_dir = f"{snapshot_dir}/content"
    images_dir = f"{snapshot_dir}/images"

    if not await aiofiles.os.path.exists(snapshot_dir):
        print(f"'{snapshot_dir}' doesn't exist, exiting")
        sys.exit(1)
    elif not await aiofiles.os.path.exists(content_dir):
        print(f"'{content_dir}' doesn't exist, exiting")
        sys.exit(1)
    elif not await aiofiles.os.path.exists(images_dir):
        print(f"'{images_dir}' doesn't exist, exiting")
        sys.exit(1)

    # restore images
    await disk_to_gridfs(fs, images_dir)
    files = await File.find().to_list()

    # restore content
    page_jsons = await aiofiles.os.listdir(content_dir)
    for page_json in page_jsons:
        print(page_json)
        page = page_json.replace(".json", "")
        page_json_path = f"{content_dir}/{page_json}"
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
