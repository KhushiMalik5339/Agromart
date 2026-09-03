import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgroMart API"
    API_V1_STR: str = "/api"
    
    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017/agromart"
    DB_NAME: str = "agromart"
    
    # JWT Auth
    JWT_SECRET: str = "agromart_super_secret_jwt_key_2026_change_in_production"
    JWT_REFRESH_SECRET: str = "agromart_super_secret_refresh_key_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = "your_google_client_id.apps.googleusercontent.com"
    
    # Razorpay
    RAZORPAY_KEY_ID: str = "rzp_test_agromart123"
    RAZORPAY_KEY_SECRET: str = "rzp_test_secret_agromart123"
    RAZORPAY_WEBHOOK_SECRET: str = "rzp_webhook_secret_123"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
