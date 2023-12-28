"""
    st_innocent/api/config.py
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Assigned through environment variables
    """

    mode: str
    project_name: str
    host: str
    admin_port: str
    ui_port: str
    api_port: str
    cors_origins: list = []
    log_path: str
    log_rotation: str
    log_retention: str
    jwt_secret_key: str
    jwt_algorithm: str
    jwt_expiration: str
    pushover_api_token: str
    google_api_key: str
    calendar_id: str
    mongo_url: str


settings = Settings()

#
# Generate CORS
#

for scheme in ["https://", "http://"]:
    for subdomain in ["www.", "www.admin.", "admin.", ""]:
        for domain in [settings.host]:
            settings.cors_origins.append(f"{scheme}{subdomain}{domain}")

for port in [settings.admin_port, settings.ui_port]:
    settings.cors_origins.append(f"http://localhost:{port}")
