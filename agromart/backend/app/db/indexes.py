import logging
from pymongo import TEXT, ASCENDING
from app.db.mongo import get_database

logger = logging.getLogger("agromart.indexes")

async def create_indexes():
    db = get_database()
    if db is None:
        return

    logger.info("Ensuring MongoDB indexes...")

    # users collection indexes
    await db.users.create_index([("email", ASCENDING)], unique=True)
    
    # categories collection indexes
    await db.categories.create_index([("slug", ASCENDING)], unique=True)

    # products collection indexes
    await db.products.create_index([("slug", ASCENDING)], unique=True)
    await db.products.create_index([("category_id", ASCENDING)])
    await db.products.create_index([("farmer_id", ASCENDING)])
    await db.products.create_index([("title", TEXT), ("description", TEXT)], name="product_text_search")

    # orders collection indexes
    await db.orders.create_index([("user_id", ASCENDING)])
    await db.orders.create_index([("order_number", ASCENDING)], unique=True)

    # carts collection index
    await db.carts.create_index([("user_id", ASCENDING)], unique=True)

    # wishlists collection index
    await db.wishlists.create_index([("user_id", ASCENDING)], unique=True)

    # reviews collection index
    await db.reviews.create_index([("product_id", ASCENDING)])

    # notifications collection index
    await db.notifications.create_index([("user_id", ASCENDING)])

    logger.info("MongoDB indexes created successfully.")
