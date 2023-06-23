"""
    st_innocent/server/routes/calendar.py
"""

import requests
from datetime import datetime
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from server.models import Response, JSONException
from server.config import settings
from server.logger import logger

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
    # today = datetime(now.year, now.month, now.day).isoformat().replace(":", "%3A")
    beg_year = datetime(now.year, 1, 1).isoformat().replace(":", "%3A")
    url = (
        "https://www.googleapis.com"
        + f"/calendar/v3/calendars/{calendar_id}/events"
        + f"?orderBy=startTime&singleEvents=true&timeMin={beg_year}Z"
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
