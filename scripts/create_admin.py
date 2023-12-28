"""
    st_innocent/scripts/create_admin.py
"""

import asyncio
from beanie import init_beanie
from api.models import Admin
from api.database import connect_to_mongo
from api.auth import get_password_hash


async def main():
    db, fs = await connect_to_mongo()
    await init_beanie(database=db, document_models=[Admin])

    username = input("username: ")
    admin = await Admin.find_one(Admin.username == username)
    if admin:
        print(f"admin with username '{username}' already exists!")
        exit(1)

    name = input("name: ")
    email = input("email: ")
    pw = input("password: ")
    token = input("pushover token: ")
    notifications = input("receive notifications ('y/n'): ")

    if notifications == "y":
        notifications = True
    elif notifications == "n":
        notifications = False
    else:
        print("answer must be 'y' or 'n'")
        exit(1)

    admin = Admin(
        username=username,
        name=name,
        email=email,
        hashed_password=get_password_hash(pw),
        pushover_token=token,
        notifications=notifications,
    )
    await admin.insert()
    print(f"created: {admin}")


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
