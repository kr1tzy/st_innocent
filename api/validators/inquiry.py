"""
    st_innocent/api/validators/inquiry.py
"""

from api.validators import phone, email, empty, too_big
from api.models.inquiry import InquiryData
from api.logger import logger


def validate_inquiry_data(data: InquiryData) -> (bool, dict):
    """
    Validates inquiry data
    """

    logger.debug("Validating InquiryData.")

    errors = {"name": "", "email": "", "phone": "", "message": ""}
    if empty(data.name):
        errors["name"] = "Name is required."
    if empty(data.email) and empty(data.phone):
        errors["email"] = "Email or phone is required."
        errors["phone"] = "Phone or email is required."
    else:
        if not empty(data.email) and not email(data.email):
            errors["email"] = "Invalid email address."
        if not empty(data.phone) and not phone(data.phone):
            errors["phone"] = "Invalid phone number."
    if too_big(data.message, 1000):
        errors["message"] = "1000 characters or less please."

    success = not any(len(v) > 0 for v in errors.values())
    logger.debug(f"\tsuccess: {success}")
    logger.debug(f"\terrors: {errors}")

    return success, errors
