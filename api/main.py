"""
    st_innocent/api/main.py
"""

from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.routes import content, pages, images, analytics, calendar, inquiries, jwt
from api.models import Admin, Content, File, Inquiry, Visitor
from api.database import connect_to_mongo
from api.logger import logger, log_requests
from api.config import settings
from beanie import init_beanie


app = FastAPI(
    title=settings.project_name, root_path="/api" if settings.mode == "prod" else ""
)
app.include_router(jwt, tags=["JWT"], dependencies=[Depends(log_requests)])
app.include_router(pages, tags=["Pages"], dependencies=[Depends(log_requests)])
app.include_router(content, tags=["Content"], dependencies=[Depends(log_requests)])
app.include_router(images, tags=["Images"], dependencies=[Depends(log_requests)])
app.include_router(analytics, tags=["Analytics"], dependencies=[Depends(log_requests)])
app.include_router(inquiries, tags=["Inquiries"], dependencies=[Depends(log_requests)])
app.include_router(calendar, tags=["Calendar"], dependencies=[Depends(log_requests)])
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def init_db():
    """
    Initializes beanie with all the models
    """
    db, _ = await connect_to_mongo()
    await init_beanie(
        database=db,
        document_models=[Admin, Content, File, Inquiry, Visitor],
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc):
    """
    Overrides the standard HTTP exception handler
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "detail": exc.detail
            if isinstance(exc.detail, str)
            else exc.detail["detail"],
            "data": [],
            "total": 0,
        },
    )


logger.info(f"Server listening @ {settings.host}:{settings.api_port}")
