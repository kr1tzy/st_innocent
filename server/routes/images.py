"""
    st_innocent/server/routes/images.py
"""

from typing import Annotated
from fastapi import APIRouter, Depends, UploadFile, Query
from fastapi.exceptions import HTTPException
from fastapi.responses import Response
from server.models import File, FileResponse, JSONException
from server.database import connect_to_mongo
from server.auth import check_access_token
from server.helpers import HumanBytes
from server.config import settings
from server.logger import logger
from bson import ObjectId

router = APIRouter(prefix="/images")


@router.get(
    "",
    responses={
        200: {"model": FileResponse},
        500: {"model": JSONException},
    },
)
async def get_images(
    _filter: str | None,
    _field: str | None,
    _order: str | None,
    _range: str | None,
    _: Annotated[str, Depends(check_access_token)],
):
    """
    Returns a list of all images
    """

    images = await File.find().to_list()  # will need modified when pdfs are added

    # sort
    if _field == "name":
        images.sort(key=lambda i: i.name, reverse=_order == "DESC")
    elif _field == "size":
        images.sort(key=lambda i: HumanBytes.unformat(i.size), reverse=_order == "DESC")
    elif _field == "content_type":
        images.sort(key=lambda i: i.content_type, reverse=_order == "DESC")

    # get range
    beg, end = eval(_range)
    images = images[beg:end]

    return FileResponse(
        **{
            "success": True,
            "detail": f"{len(images)} image(s).",
            "total": len(images),
            "data": images,
        }
    )


@router.get(
    "/{id}",
    responses={
        200: {
            "content": {
                "image/png": {},
                "image/jpeg": {},
                "image/svg+xml": {},
            },
            "description": "Returns the image's JSON or the raw image.",
        },
        404: {"model": JSONException},
    },
    response_model=FileResponse,
)
async def get_image(id: str, raw: bool | None = None):
    """
    Returns the image json or raw content
    """

    image = await File.get(id)
    if image is None:
        err = f"Image {id} not saved in db."
        logger.error(err)
        raise HTTPException(
            status_code=404,
            detail={"detail": err},
        )

    logger.info(f"Retrieved image {id} from db.")

    try:
        if raw:
            _, fs = await connect_to_mongo()
            gridfs_image = await fs.open_download_stream(ObjectId(image.gridfs_id))
            image_bytes = await gridfs_image.read()
            return Response(content=image_bytes, media_type=image.content_type)

        return FileResponse(
            **{
                "success": True,
                "detail": f"Retrieved image {id}.",
                "data": image,
                "total": 1,
            }
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e


@router.post(
    "/upload",
    responses={
        200: {"model": FileResponse},
        406: {"model": JSONException},
    },
)
async def upload_image(
    uploaded_image: UploadFile, _: Annotated[str, Depends(check_access_token)]
):
    """
    Saves uploaded image in db
    """

    image = await File.find_one(File.name == uploaded_image.filename)
    if image:
        err = f"{uploaded_image.filename} already saved!"
        logger.error(err)
        raise HTTPException(
            status_code=406,
            detail={"detail": err},
        )

    try:
        _, fs = await connect_to_mongo()
        gridfs_id = await fs.upload_from_stream(
            uploaded_image.filename, await uploaded_image.read()
        )

        new_image = File(
            gridfs_id=str(gridfs_id),
            name=uploaded_image.filename,
            content_type=uploaded_image.content_type,
            size=HumanBytes.format(uploaded_image.size, True),
            admin_url="",
        )

        await new_image.insert()
        await new_image.set(
            {
                File.admin_url: f"http://{settings.host}:{settings.server_port}/images/{new_image.id}?raw=true"
                if settings.mode == "dev"
                else f"https://admin.{settings.host}/api/images/{new_image.id}?raw=true"
            }
        )

    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e

    return FileResponse(
        success=True,
        detail=f"Saved {new_image.name}",
        data=new_image,
        total=1,
    )


@router.put(
    "/{id}",
    responses={
        200: {"model": FileResponse},
        406: {"model": JSONException},
        500: {"model": JSONException},
    },
)
async def update_image(
    id: str, updated_image: File, _: Annotated[str, Depends(check_access_token)]
):
    """
    Updates the image name
    """

    image = await File.get(id)
    if image is None:
        err = f"Image {id} is not saved."
        logger.error(err)
        raise HTTPException(
            status_code=406,
            detail={"detail": err},
        )

    prev_name = image.name

    try:
        _, fs = await connect_to_mongo()
        await image.set({File.name: updated_image.name})
        await fs.rename(ObjectId(image.gridfs_id), updated_image.name)
        logger.info(f"Updated {image.name} to {updated_image.name}")
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e

    return FileResponse(
        **{
            "success": True,
            "detail": f"{prev_name} updated to {updated_image.name}",
            "data": image,
            "total": 1,
        }
    )


@router.delete(
    "/{id}",
    responses={
        200: {"model": FileResponse},
        404: {"model": JSONException},
        500: {"model": JSONException},
    },
)
async def delete_image(id: str, _: Annotated[str, Depends(check_access_token)]):
    """
    Deletes a image from db & gridfs.
    """

    image = await File.get(id)
    if image is None:
        err = f"Image {id} not saved!"
        logger.error(err)
        raise HTTPException(
            status_code=404,
            detail={"detail": err},
        )

    try:
        _, fs = await connect_to_mongo()
        await fs.delete(ObjectId(image.gridfs_id))
        await image.delete()
        logger.info(f"Deleted image {id} from db & gridfs.")
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e

    return FileResponse(
        success=True,
        detail=f"Deleted {image.name}!",
        data=image,
        total=1,
    )


@router.delete(
    "",
    responses={
        200: {"model": FileResponse},
        404: {"model": JSONException},
        500: {"model": JSONException},
    },
)
async def delete_multiple(
    _: Annotated[str, Depends(check_access_token)],
    ids: Annotated[list[str] | None, Query()] = None,
):
    """
    Deletes multiple images from db & GridFS
    """

    deleted_images = []
    for id in ids:
        image = await File.get(id)
        if image is None:
            err = f"Image {id} not saved!"
            logger.error(err)
            raise HTTPException(
                status_code=404,
                detail={"detail": err},
            )

        try:
            _, fs = await connect_to_mongo()
            await fs.delete(ObjectId(image.gridfs_id))
            await image.delete()
            logger.info(f"Deleted image {id} from db & gridfs.")
            deleted_images.append(image)
        except Exception as e:
            err = f"{e.__class__.__name__}: {e}"
            logger.error(err)
            raise HTTPException(
                status_code=500,
                detail={"detail": err},
            ) from e

    return FileResponse(
        **{
            "success": True,
            "detail": f"Deleted {len(deleted_images)} image(s).",
            "total": len(deleted_images),
            "data": deleted_images,
        }
    )
