"""
    st_innocent/scripts/content_crud.py
"""

import sys, asyncio
from beanie import init_beanie
from api.models import Content
from api.database import connect_to_mongo


async def main(kind, page, name, data):
    """
    CRUD
    """
    db, _ = await connect_to_mongo()
    await init_beanie(database=db, document_models=[Content])

    if kind == "create":
        content = Content(name=name, page=page, data=data)
        await content.insert()
        print(f"Created: {content}")
    elif kind == "read":
        contents = await Content.find_one(Content.page == page and Content.name == name)
        print(f"Read: {contents}")
    elif kind == "update":
        content = await Content.find_one(Content.page == page and Content.name == name)
        if content is None:
            print("No content found to update.")
            sys.exit(1)
        await content.set({Content.name: name, Content.data: data})
        print(f"Updated: {content}")
    elif kind == "delete":
        contents = await Content.find_one(Content.page == page and Content.name == name)
        for content in contents:
            await content.delete()
            print(f"Deleted: {content}")


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in ["create", "read", "update", "delete"]:
        print(f"Usage: python {__file__.split('/')[-1]} <create|read|update|delete> <page> <name> <data (create/update)>")
        print(f"        - <data>: input goes into eval()")
        sys.exit(1)

    kind = sys.argv[1]

    if kind in ["read", "delete"] and len(sys.argv) != 4:
        print(f"Usage: python {__file__.split('/')[-1]} <read|delete> <page> <name>")
        sys.exit(1)

    if kind in ["create", "update"] and len(sys.argv) != 5:
        print(f"Usage: python {__file__.split('/')[-1]} <create|update> <page> <name> <data>")
        print(f"        - <data>: input goes into eval()")
        sys.exit(1)


    page = sys.argv[2]
    name = sys.argv[3]
    data = None

    if kind in ["create", "update"]:
        if '{' in sys.argv[4] or '[' in sys.argv[4]:
            data = eval(sys.argv[4])
        else:
            data = sys.argv[4]

    asyncio.get_event_loop().run_until_complete(main(kind, page, name, data))
