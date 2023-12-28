"""
    st_innocent/api/routes/analytics.py
"""

import requests
from dateutil import parser
from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from api.models.visitor import Visitor, VisitorIP, VisitorData
from api.models.responses import Response, AnalyticsResponse, JSONException
from api.logger import logger
from api.auth import check_access_token


router = APIRouter(prefix="/analytics")


@router.get(
    "",
    responses={
        200: {"model": Response},
        500: {"model": JSONException},
    },
)
async def get_totals(_: Annotated[str, Depends(check_access_token)]):
    """
    Analytic totals
    """

    totals = {"visits": 0, "unique": 0, "cities": [], "states": [], "countries": []}

    try:
        visitors = await Visitor.find({}).to_list()
        for visitor in visitors:
            totals["unique"] += 1
            totals["visits"] += visitor.visits
            if visitor.data.city not in totals["cities"]:
                totals["cities"].append(visitor.data.city)
            if visitor.data.region_name not in totals["states"]:
                totals["states"].append(visitor.data.region_name)
            if visitor.data.country_code not in totals["countries"]:
                totals["countries"].append(visitor.data.country_code)

        logger.debug(totals)

        return Response(
            success=True,
            detail="Returning analytic totals.",
            total=len(totals.keys()),
            data={**totals},
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e


@router.get(
    "/visitors",
    responses={
        200: {"model": Response},
        500: {"model": JSONException},
    },
)
async def get_visitors(_: Annotated[str, Depends(check_access_token)]):
    """
    Get all visitors
    """

    try:
        visitors = await Visitor.find({}).to_list()
        return AnalyticsResponse(
            success=True,
            detail=f"{len(visitors)} visitors",
            total=len(visitors),
            data=visitors,
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e


@router.post(
    "/visitor",
    responses={
        200: {"model": Response},
        500: {"model": JSONException},
    },
)
async def site_visit(data: VisitorIP):
    """
    Save visitor info
    """

    try:
        res = requests.get(f"http://ip-api.com/json/{data.ip}", timeout=5)
        visitor_data = res.json()  # user info from ip
        data = VisitorData(
            isp=visitor_data["isp"],
            autonomous_sys=visitor_data["as"],
            ip_address=visitor_data["query"],
            city=visitor_data["city"],
            country_code=visitor_data["countryCode"],
            latitude=visitor_data["lat"],
            longitude=visitor_data["lon"],
            org=visitor_data["org"],
            region=visitor_data["region"],
            region_name=visitor_data["regionName"],
            timezone=visitor_data["timezone"],
            zip_code=visitor_data["zip"],
        )
        now = datetime.now().isoformat()
        dt = parser.isoparse(now)
        when = dt.strftime("%m/%d/%Y - %I:%M:%S %p")
        visitor = await Visitor.find_one(Visitor.data.ip_address == data.ip_address)
        if visitor is None:
            visitor = Visitor(visits=1, last_visit=when, data=data)
            await visitor.insert()
            logger.debug(f"created: {visitor.data.ip_address}")
        else:
            await visitor.set(
                {
                    Visitor.visits: visitor.visits + 1,
                    Visitor.last_visit: when,
                    Visitor.data: data,
                }
            )
            logger.debug(f"updated: {visitor.data.ip_address}")

        return Response(
            success=True,
            detail="yep",
            total=0,
            data=[],
        )
    except Exception as e:
        err = f"{e.__class__.__name__}: {e}"
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail={"detail": err},
        ) from e
