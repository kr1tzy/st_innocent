"""
    st_innocent/api/routes/calendar.py
"""

import requests
from datetime import datetime
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from api.models import Response, JSONException
from api.config import settings
from api.logger import logger

router = APIRouter(prefix="/calendar")


@router.get(
    "/events",
    responses={
        200: {"model": Response},
        500: {"model": JSONException},
    },
)
async def get_events():
    """
    Returns a formatted list of events from the google calendar
    """

    now = datetime.today()
    calendar_id = settings.calendar_id.replace("@", "%40")
    start = (  # starts at the beginning of the previous month (unless new year)
        datetime(now.year, now.month - 1 if now.month != 1 else now.month, 1)
        .isoformat()
        .replace(":", "%3A")
    )
    url = (
        "https://www.googleapis.com"
        + f"/calendar/v3/calendars/{calendar_id}/events"
        + f"?orderBy=startTime&singleEvents=true&timeMin={start}Z"
        + f"&key={settings.google_api_key}"
    )
    headers = {"Accept": "application/json"}

    try:
        # Send the request
        res = requests.get(url, headers, timeout=5)

        # Get event data
        data = res.json().get("items", [])

        # Filter it
        events = []
        for event in data:
            start = (event["start"].get("dateTime", event["end"].get("date")),)
            end = (event["end"].get("dateTime", event["end"].get("date")),)
            events.append(
                {
                    "title": event["summary"],
                    "start": start,
                    "end": end,
                    "allDay": start == end,
                }
            )

        # Return it
        return Response(
            **{
                "success": True,
                "detail": f"{len(events)} events.",
                "total": len(events),
                "data": events,
            }
        )

    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e
