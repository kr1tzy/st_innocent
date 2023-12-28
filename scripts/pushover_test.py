"""
    st_innocent/scripts/pushover_test.py
"""

import sys, asyncio, requests
from beanie import init_beanie
from api.models import Admin
from api.config import settings
from api.database import connect_to_mongo


async def send_message(text):
    """
    Sends to all admins with notifications turned on
    """
    admins = await Admin.find(Admin.notifications == True).to_list()
    for admin in admins:
        payload = {
            "message": text,
            "user": admin.pushover_token,
            "token": settings.pushover_api_token,
        }
        r = requests.post(
            "https://api.pushover.net/1/messages.json",
            headers={"User-Agent": "Python"},
            data=payload,
            timeout=5,
        )
        if not r.status_code == 200:
            print(r.text)


async def main():
    db, _ = await connect_to_mongo()
    await init_beanie(database=db, document_models=[Admin])
    text = " ".join(sys.argv[1:])  # message text
    await send_message(text)
    print("done")


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
