"""
    st_innocent/run.py
"""

import os
import sys
import uvicorn
import argparse
import threading
import subprocess
from api.config import settings
from api.logger import CustomLogger, logger as api_logger


def ui_dev():
    """
    Start the next.js ui application in dev mode.
    """

    ui_logger = CustomLogger.make_logger("ui")
    ui_logger.info("Starting next.js ui.")
    with subprocess.Popen(
        "cd ui && yarn run dev",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        encoding="utf-8",
        shell=True,
        env=os.environ,
    ) as proc:
        while proc.poll() is None:
            out = proc.stdout.readline()
            err = proc.stderr.readline()
            out = out.replace("\n", "")
            err = err.replace("\n", "")
            sys.stdout.flush()
            sys.stderr.flush()
            if len(err) > 0:
                ui_logger.error(err)
            elif len(out) > 0:
                ui_logger.info(out)


def admin_dev():
    """
    Start the vite admin application in dev mode.
    """
    admin_logger = CustomLogger.make_logger("admin")
    admin_logger.info("Starting vite admin app.")
    with subprocess.Popen(
        "cd admin && yarn run start",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        encoding="utf-8",
        shell=True,
        env=os.environ,
    ) as proc:
        while proc.poll() is None:
            out = proc.stdout.readline()
            err = proc.stderr.readline()
            out = out.replace("\n", "")
            err = err.replace("\n", "")
            sys.stdout.flush()
            sys.stderr.flush()
            if len(err) > 0:
                admin_logger.error(err)
            elif len(out) > 0:
                admin_logger.info(out)


def api_dev():
    """
    Start the api in dev mode.
    """
    api_logger.info("Starting FastAPI/Uvicorn app.")
    uvicorn.run(
        "api.main:app",
        host=settings.host,
        port=int(settings.api_port),
        log_level="debug" if settings.mode == "dev" else "info",
        reload=True,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="St. Innocent's Webapp",
        description="FastAPI api / Next.js ui / Vite Admin",
        epilog="run.py: command line utilities",
    )
    parser.add_argument("-b", "--build", action="store_true", help="production build")
    parser.add_argument("-s", "--api", action="store_true", help="only fastapi/uvicorn")
    parser.add_argument("-a", "--admin", action="store_true", help="only vite admin")
    parser.add_argument("-d", "--dev", action="store_true", help="development run")
    args = parser.parse_args()

    if args.dev:
        admin = threading.Thread(target=admin_dev, args=())
        ui = threading.Thread(target=ui_dev, args=())
        ui.start()
        admin.start()
        api_dev()
    if args.api:
        api_dev()
    if args.admin:
        admin_dev()
    else:
        api_logger.info(f"{args} not supported.")
