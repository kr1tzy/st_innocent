"""
    st_innocent/scripts/beanie_crud_example.py
"""

import sys, asyncio
from beanie import init_beanie
from api.models import Content
from api.database import connect_to_mongo


async def main(arg):
    """
    Beanie CRUD example
    """
    db, _ = await connect_to_mongo()
    await init_beanie(database=db, document_models=[Content])

    if arg == "create":
        # content = Content(name="prayer", page="example", data=["Lord", "have", "mercy"])
        content = Content(name="title", page="example", data="Example")
        await content.insert()
        print(f"created: {content}")
    elif arg == "read":
        contents = await Content.find(Content.page == "example").to_list()
        print(f"read: {contents}")
    elif arg == "update":
        content = await Content.find_one(Content.page == "example")
        if content is None:
            print("no example content created")
            sys.exit(1)
        await content.set(
            {
                Content.name: "Jesus Prayer",
                Content.data: "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
            }
        )
        print(f"updated: {content}")
    elif arg == "delete":
        contents = await Content.find(Content.page == "example").to_list()
        for content in contents:
            await content.delete()
            print(f"deleted: {content}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Needs arg: 'create', 'read', 'update', or 'delete'")
        sys.exit(1)

    asyncio.get_event_loop().run_until_complete(main(sys.argv[1]))
