import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from app.core.config import settings

MONGODB_URI = settings.MONGODB_URI
DB_NAME = settings.DB_NAME

async def seed_database():
    print("Connecting to MongoDB for seeding...")
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.get_database(DB_NAME)

    # 1. Clear existing collections
    print("Clearing existing collections...")
    for col in ["users", "farmer_profiles", "categories", "products", "coupons", "reviews"]:
        await db[col].delete_many({})

    # 2. Seed Users
    print("Seeding users...")
    password_hash = pwd_context.hash("password123")

    customer_doc = {
        "name": "Ananya Sharma",
        "email": "customer@agromart.com",
        "password_hash": password_hash,
        "role": "customer",
        "phone": "+919876543210",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        "created_at": datetime.utcnow()
    }
    cust_res = await db.users.insert_one(customer_doc)

    farmer_user_doc = {
        "name": "Rajesh Organic Patel",
        "email": "farmer@agromart.com",
        "password_hash": password_hash,
        "role": "farmer",
        "phone": "+919812345678",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        "created_at": datetime.utcnow()
    }
    farm_user_res = await db.users.insert_one(farmer_user_doc)

    admin_user_doc = {
        "name": "AgroMart Admin",
        "email": "admin@agromart.com",
        "password_hash": password_hash,
        "role": "admin",
        "phone": "+919999999999",
        "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
        "created_at": datetime.utcnow()
    }
    admin_user_res = await db.users.insert_one(admin_user_doc)

    # 3. Seed Farmer Profile
    print("Seeding farmer profiles...")
    farmer_profile_doc = {
        "user_id": farm_user_res.inserted_id,
        "farm_name": "Patel Organic Bio-Farms",
        "bio": "3rd generation organic farmer specializing in Kashmiri saffron, native spinach, and heirloom tomatoes.",
        "location": {
            "address": "Kashmir & Nashik Valley",
            "city": "Nashik",
            "state": "Maharashtra",
            "lat": 19.9975,
            "lng": 73.7898
        },
        "verified": True,
        "rating_avg": 4.95,
        "created_at": datetime.utcnow()
    }
    fp_res = await db.farmer_profiles.insert_one(farmer_profile_doc)
    farmer_id = fp_res.inserted_id

    # 4. Seed Categories
    print("Seeding categories...")
    veg_doc = {"name": "Fresh Vegetables", "slug": "vegetables", "icon": "eco"}
    fruit_doc = {"name": "Organic Fruits", "slug": "fruits", "icon": "nutrition"}
    spice_doc = {"name": "Exotic Spices & Saffron", "slug": "spices", "icon": "local_florist"}
    seed_doc = {"name": "Seeds & Grains", "slug": "seeds-grains", "icon": "grain"}

    veg_res = await db.categories.insert_one(veg_doc)
    fruit_res = await db.categories.insert_one(fruit_doc)
    spice_res = await db.categories.insert_one(spice_doc)
    seed_res = await db.categories.insert_one(seed_doc)

    # 5. Seed Products
    print("Seeding products...")
    products = [
        {
            "farmer_id": farmer_id,
            "title": "Pure Kashmiri Organic Saffron (Kesar)",
            "slug": "pure-kashmiri-organic-saffron",
            "category_id": spice_res.inserted_id,
            "description": "100% pure Mongra grade Kashmir saffron threads, hand-harvested from Pampore fields. High crocin content delivering intense aroma, rich crimson color, and authentic medicinal properties.",
            "benefits": [
                "100% Hand-Harvested Mongra Threads",
                "Rich in Natural Antioxidants & Crocin",
                "Certified Organic & Chemical-Free",
                "Direct Farm Traceability to Pampore, Kashmir"
            ],
            "nutrition": {"calories": "310 kcal/100g", "protein": "11.4g", "carbs": "65.4g", "fats": "5.8g"},
            "images": [
                "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
            ],
            "price": 649.0,
            "unit": "1 gram",
            "stock_qty": 50,
            "is_organic": True,
            "badges": ["GI Tagged", "Direct From Kashmir", "Grade A+ Mongra"],
            "rating_avg": 4.9,
            "rating_count": 28,
            "status": "active",
            "created_at": datetime.utcnow()
        },
        {
            "farmer_id": farmer_id,
            "title": "Farm Fresh Farm-Fresh Spinach (Palak)",
            "slug": "farm-fresh-organic-spinach",
            "category_id": veg_res.inserted_id,
            "description": "Crisp, nutrient-dense organic spinach leaves harvested daily at dawn without synthetic pesticides.",
            "benefits": ["High Iron & Vitamin C", "Zero Chemical Sprays", "Washed with Purified Ozone Water"],
            "nutrition": {"calories": "23 kcal/100g", "protein": "2.9g", "carbs": "3.6g", "fats": "0.4g"},
            "images": ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800"],
            "price": 45.0,
            "unit": "500g",
            "stock_qty": 120,
            "is_organic": True,
            "badges": ["Morning Harvest", "100% Pesticide Free"],
            "rating_avg": 4.8,
            "rating_count": 42,
            "status": "active",
            "created_at": datetime.utcnow()
        },
        {
            "farmer_id": farmer_id,
            "title": "Organic Alphonso Mangoes (Devgad)",
            "slug": "organic-alphonso-mangoes",
            "category_id": fruit_res.inserted_id,
            "description": "Naturally tree-ripened Konkan Alphonso mangoes with rich aroma, buttery texture, and heavenly sweetness.",
            "benefits": ["Naturally Carbide-Free", "Rich in Vitamin A & Fiber", "Geographical Indication (GI) Certified"],
            "nutrition": {"calories": "60 kcal/100g", "protein": "0.8g", "carbs": "15.0g", "fats": "0.4g"},
            "images": ["https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800"],
            "price": 899.0,
            "unit": "1 dozen",
            "stock_qty": 35,
            "is_organic": True,
            "badges": ["Devgad Origin", "Carbide Free"],
            "rating_avg": 4.95,
            "rating_count": 56,
            "status": "active",
            "created_at": datetime.utcnow()
        },
        {
            "farmer_id": farmer_id,
            "title": "Heirloom Red Tomatoes",
            "slug": "heirloom-red-tomatoes",
            "category_id": veg_res.inserted_id,
            "description": "Juicy, sun-ripened heirloom tomatoes grown naturally in soil enriched with organic compost.",
            "benefits": ["Rich Lycopene Content", "Natural Tangy Taste", "Non-GMO Seed Stock"],
            "nutrition": {"calories": "18 kcal/100g", "protein": "0.9g", "carbs": "3.9g", "fats": "0.2g"},
            "images": ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800"],
            "price": 38.0,
            "unit": "1 kg",
            "stock_qty": 200,
            "is_organic": True,
            "badges": ["Sun Ripened", "Non-GMO"],
            "rating_avg": 4.7,
            "rating_count": 19,
            "status": "active",
            "created_at": datetime.utcnow()
        }
    ]

    await db.products.insert_many(products)

    # 6. Seed Coupons
    print("Seeding coupons...")
    coupons = [
        {
            "code": "AGRO10",
            "discount_type": "percent",
            "value": 10.0,
            "min_order_value": 300.0,
            "valid_from": datetime.utcnow(),
            "valid_to": datetime(2030, 1, 1),
            "usage_limit": 500,
            "used_count": 12
        },
        {
            "code": "ORGANIC50",
            "discount_type": "flat",
            "value": 50.0,
            "min_order_value": 500.0,
            "valid_from": datetime.utcnow(),
            "valid_to": datetime(2030, 1, 1),
            "usage_limit": 200,
            "used_count": 5
        }
    ]
    await db.coupons.insert_many(coupons)

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
