"""
    st_innocent/api/models/pages.py
"""

from pydantic import BaseModel, Field


class Page(BaseModel):
    """
    Base page model
    """

    id: str =  Field(alias="_id")
    title: str


#
# Index page
#


class FAQ(BaseModel):
    """
    FAQ for home page
    """

    question: str
    answer: str


class PLItem(BaseModel):
    """
    Parish life item for home page
    """

    title: str
    image: str
    text: str


class WWAItem(BaseModel):
    """
    Who we are item for home page
    """

    title: str
    image: str
    text: str


class Index(Page):
    """
    Index page model
    """

    hero_bg: str
    hero_svg: str
    welcome_svg: str
    welcome_text: str
    produce_dist: str
    community_meal: str
    faqs_bg: str
    faqs: list[FAQ]
    parish_life_items: list[PLItem]
    calendar_bg: str
    calendar_add_link: str
    who_we_are_items: list[WWAItem]
    support_link: str
    address: str
    email: str
    phone: str
    facebook: str
    footer_img: str
