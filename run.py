"""
    st_innocent/run.py
"""

import os
import sys
import uvicorn
import argparse
import threading
import subprocess
from server.config import settings
from server.logger import CustomLogger, logger as server_logger


def client_dev():
    """
    Start the client application in dev mode.
    """

    client_logger = CustomLogger.make_logger("client")
    client_logger.info("Starting next.js client.")
    with subprocess.Popen(
        "cd client && yarn run dev",
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
                client_logger.error(err)
            elif len(out) > 0:
                client_logger.info(out)


def admin_dev():
    """
    Start the admin application in dev mode.
    """
    admin_logger = CustomLogger.make_logger("admin")
    admin_logger.info("Starting admin app.")
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


def server_dev():
    """
    Start the server in dev mode.
    """
    server_logger.info("Starting fastapi/uvicorn server.")
    uvicorn.run(
        "server.main:app",
        host=settings.host,
        port=int(settings.server_port),
        log_level="debug" if settings.mode == "dev" else "info",
        reload=True,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="St. Innocent's Webapp",
        description="FastAPI server / Next.js client / CRA Admin",
        epilog="run.py: command line utilities",
    )
    parser.add_argument("-b", "--build", action="store_true", help="production build")
    parser.add_argument("-s", "--server", action="store_true", help="only uvicorn")
    parser.add_argument("-a", "--admin", action="store_true", help="only cra admin")
    parser.add_argument("-d", "--dev", action="store_true", help="development run")
    args = parser.parse_args()

    if args.dev:
        admin = threading.Thread(target=admin_dev, args=())
        client = threading.Thread(target=client_dev, args=())
        client.start()
        admin.start()
        server_dev()
    if args.server:
        server_dev()
    if args.admin:
        admin_dev()
    else:
        server_logger.info(f"{args} not supported.")
