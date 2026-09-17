import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

import certifi

logger = logging.getLogger("agromart.db")

class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db = Database()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    # Use certifi CA certificates if connecting to remote/Atlas with TLS
    connect_kwargs = {}
    if "mongodb+srv" in settings.MONGODB_URI or "ssl=true" in settings.MONGODB_URI.lower() or "tls=true" in settings.MONGODB_URI.lower():
        connect_kwargs["tlsCAFile"] = certifi.where()

    db.client = AsyncIOMotorClient(settings.MONGODB_URI, **connect_kwargs)
    db.db = db.client.get_database(settings.DB_NAME)
    logger.info("Connected to MongoDB successfully!")

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
    logger.info("MongoDB connection closed.")

def get_database() -> AsyncIOMotorDatabase:
    return db.db
