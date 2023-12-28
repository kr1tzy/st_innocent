"""
    st_innocent/api/validators/__init__.py
"""

import re

#
# Generic Validators
#


def empty(string: str) -> bool:
    """
    Empty string validator
    """
    return len(string) == 0


def too_big(string: str, size: int) -> bool:
    """
    String size validator
    """
    return len(string) > size


def phone(number: str) -> bool:
    """
    Phone number validator
    """
    regex = r"[\+\d]?(\d{2,3}[-\.\s]??\d{2,3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})"
    match = re.search(regex, number)
    return match is not None


def email(address: str) -> bool:
    """
    Email address validator
    """
    regex = r"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
    match = re.search(regex, address)
    return match is not None
