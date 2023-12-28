"""
    st_innocent/scripts/update_admin.py
"""

import asyncio
from beanie import init_beanie
from api.models import Admin
from api.database import connect_to_mongo
from api.auth import get_password_hash


async def main():
    db, fs = await connect_to_mongo()
    await init_beanie(
        database=db,
        document_models=[Admin],
    )

    username = input("admin username: ")
    if len(username) == 0:
        print("need a username!")
        exit(1)

    admin = await Admin.find_one(Admin.username == username)
    if admin is None:
        print(f"admin with username '{username}' doesn't exist!")
        exit(1)

    print("(hit enter to skip updating a field)")
    username = input("username: ")
    name = input("name: ")
    email = input("email: ")
    pw = input("password: ")
    token = input("pushover token: ")
    notifications = input("receive notifications ('y/n'): ")

    if len(username) > 0:
        await admin.set({Admin.username: username})
    if len(name) > 0:
        await admin.set({Admin.name: name})
    if len(email) > 0:
        await admin.set({Admin.email: email})
    if len(pw) > 0:
        await admin.set({Admin.hashed_password: get_password_hash(pw)})
    if len(token) > 0:
        await admin.set({Admin.pushover_token: token})
    if len(notifications) > 0:
        if notifications == "y":
            notifications = True
        elif notifications == "n":
            notifications = False
        else:
            print("answer must be 'y' or 'n'")
            exit(1)
        await admin.set({Admin.notifications: notifications})
    print(f"updated: {admin}")


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
