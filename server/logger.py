"""
    st_innocent/server/logger.py
"""

import sys
import logging
from pathlib import Path
from loguru import logger
from server.config import settings
from fastapi import Request


class InterceptHandler(logging.Handler):
    """
    Override the standard log handler.
    """

    loglevel_mapping = {
        50: "CRITICAL",
        40: "ERROR",
        30: "WARNING",
        20: "INFO",
        10: "DEBUG",
        0: "NOTSET",
    }

    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except AttributeError:
            level = self.loglevel_mapping[record.levelno]

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        log = logger.bind(id="server")
        log.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


class CustomLogger:
    """
    Custom logger class
    """

    @classmethod
    def make_logger(cls, _id: str):
        log_format = (
            "<level>{level}</level> "
            "<blue>{time:YYYY-MM-DD HH:mm:ss}</blue> "
            "<red>{extra[id]}</red> "
            "- <cyan>{name}</cyan>:<cyan>{function}</cyan> - "
            "<level>{message}</level>"
        )

        _logger = cls.customize_logging(
            _id,
            settings.log_path,
            level="debug" if settings.mode == "dev" else "info",
            retention=settings.log_retention,
            rotation=settings.log_rotation,
            format=log_format,
        )
        return _logger

    @classmethod
    def customize_logging(
        cls,
        _id: str,
        filepath: Path,
        level: str,
        rotation: str,
        retention: str,
        format: str,
    ):
        if _id == "server":
            logger.remove()
            logger.add(
                sys.stdout,
                enqueue=True,
                backtrace=True,
                level=level.upper(),
                format=format,
            )
            logger.add(
                str(filepath),
                colorize=True,
                rotation=rotation,
                retention=retention,
                enqueue=True,
                backtrace=True,
                level=level.upper(),
                format=format,
            )

        return logger.bind(id=_id, method=None)


logger = CustomLogger.make_logger("server")


async def log_requests(request: Request):
    """
    Dependency for all received requests
    """
    logger.info(f"{request.method} {request.url}")
    logger.debug("Headers:")
    for name, value in request.headers.items():
        logger.debug(f"\t{name}: {value}")
    logger.debug("Path params:")
    for name, value in request.path_params.items():
        logger.debug(f"\t{name}: {value}")
    logger.debug("Query params:")
    for name, value in request.query_params.items():
        logger.debug(f"\t{name}: {value}")
