import logging
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings

logger = logging.getLogger("agromart.google")

def verify_google_id_token(token_str: str) -> dict:
    # If mock token for development testing
    if token_str.startswith("mock_google_token_"):
        return {
            "sub": "google_mock_12345",
            "email": "googleuser@agromart.com",
            "name": "Google Organic User",
            "picture": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
        }
    try:
        id_info = id_token.verify_oauth2_token(token_str, requests.Request(), settings.GOOGLE_CLIENT_ID)
        return id_info
    except Exception as e:
        logger.error(f"Google ID token verification failed: {e}")
        raise ValueError("Invalid Google ID token")
