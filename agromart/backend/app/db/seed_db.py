import asyncio
from datetime import datetime
from app.db.mongo import connect_to_mongo, close_mongo_connection, db
from app.core.security import get_password_hash

async def seed():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    
    # 1. Users
    print("Seeding Users...")
    await db.users.delete_many({})
    admin_hash = get_password_hash("password123")
    farmer_hash = get_password_hash("password123")
    customer_hash = get_password_hash("password123")
    
    admin_user = {
        "name": "AgroMart Admin",
        "email": "admin@agromart.com",
        "hashed_password": admin_hash,
        "role": "admin",
        "created_at": datetime.utcnow()
    }
    r_admin = await db.users.insert_one(admin_user)
    
    farmer_user = {
        "name": "Rajesh Patel",
        "email": "farmer@agromart.com",
        "hashed_password": farmer_hash,
        "role": "farmer",
        "created_at": datetime.utcnow()
    }
    r_farmer = await db.users.insert_one(farmer_user)
    
    customer_user = {
        "name": "Priya Sharma",
        "email": "customer@agromart.com",
        "hashed_password": customer_hash,
        "role": "customer",
        "created_at": datetime.utcnow()
    }
    r_customer = await db.users.insert_one(customer_user)
    
    # 2. Farmer Profile
    print("Seeding Farmer Profile...")
    await db.farmer_profiles.delete_many({})
    farmer_profile = {
        "user_id": r_farmer.inserted_id,
        "farm_name": "Patel Organic Farms",
        "bio": "Certified organic farm in Nashik bringing fresh chemical-free produce directly to households.",
        "location": {
            "address": "Panchavati Farm Road",
            "city": "Nashik",
            "state": "Maharashtra",
            "lat": 19.9975,
            "lng": 73.7898
        },
        "farming_type": "100% Certified Organic (NPOP)",
        "verification_details": "NPOP-ORG-2023-MH-0842",
        "verified": True,
        "rating_avg": 4.9,
        "created_at": datetime.utcnow()
    }
    r_profile = await db.farmer_profiles.insert_one(farmer_profile)
    
    # 3. Categories
    print("Seeding Categories...")
    await db.categories.delete_many({})
    categories = [
        {"name": "Vegetables", "slug": "vegetables", "icon": "eco"},
        {"name": "Fruits", "slug": "fruits", "icon": "nutrition"},
        {"name": "Grains", "slug": "grains", "icon": "grain"},
        {"name": "Seeds", "slug": "seeds", "icon": "spa"},
        {"name": "Dairy Products", "slug": "dairy", "icon": "egg"},
        {"name": "Spices", "slug": "spices", "icon": "local_florist"},
        {"name": "Other Agricultural Products", "slug": "organic-farming", "icon": "agriculture"},
    ]
    cat_map = {}
    for c in categories:
        res = await db.categories.insert_one(c)
        cat_map[c["slug"]] = res.inserted_id

    # 4. Products
    print("Seeding Realistic Agricultural Products...")
    await db.products.delete_many({})
    sample_products = [
        {
            "farmer_id": r_profile.inserted_id,
            "category_id": cat_map["vegetables"],
            "title": "Farm Fresh Organic Tomatoes",
            "slug": "farm-fresh-organic-tomatoes",
            "description": "Vine-ripened organic tomatoes grown without chemical pesticides or artificial ripeners.",
            "images": ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800"],
            "price": 45.0,
            "unit": "kg",
            "stock_qty": 120,
            "is_organic": True,
            "badges": ["Daily Fresh"],
            "rating_avg": 4.8,
            "rating_count": 42,
            "status": "active",
            "created_at": datetime.utcnow()
        },
        {
            "farmer_id": r_profile.inserted_id,
            "category_id": cat_map["vegetables"],
            "title": "Mountain Grown Organic Potatoes",
            "slug": "mountain-grown-organic-potatoes",
            "description": "Unpolished earthy potatoes grown in nutrient-rich virgin soil.",
            "images": ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800"],
            "price": 35.0,
            "unit": "kg",
            "stock_qty": 250,
            "is_organic": True,
            "badges": ["Unpolished"],
            "rating_avg": 4.7,
            "rating_count": 36,
            "status": "active",
            "created_at": datetime.utcnow()
        },
        {
            "farmer_id": r_profile.inserted_id,
            "category_id": cat_map["fruits"],
            "title": "Kashmiri Royal Delicious Red Apples",
            "slug": "kashmiri-royal-delicious-red-apples",
            "description": "High altitude wax-free Kashmiri apples from organic valley orchards.",
            "images": ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800"],
            "price": 180.0,
            "unit": "kg",
            "stock_qty": 85,
            "is_organic": True,
            "badges": ["Wax Free"],
            "rating_avg": 4.95,
            "rating_count": 88,
            "status": "active",
            "created_at": datetime.utcnow()
        },
        {
            "farmer_id": r_profile.inserted_id,
            "category_id": cat_map["spices"],
            "title": "Pure Kashmiri Mongra Saffron (Grade A1)",
            "slug": "pure-kashmiri-mongra-saffron-grade-a1",
            "description": "Authentic Pampore GI-tagged saffron stigmata with intense aroma and deep crimson strands.",
            "images": ["https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800"],
            "price": 490.0,
            "unit": "1g box",
            "stock_qty": 100,
            "is_organic": True,
            "badges": ["GI Tagged"],
            "rating_avg": 5.0,
            "rating_count": 185,
            "status": "active",
            "created_at": datetime.utcnow()
        },
        {
            "farmer_id": r_profile.inserted_id,
            "category_id": cat_map["dairy"],
            "title": "Pure A2 Gir Cow Fresh Raw Milk",
            "slug": "pure-a2-gir-cow-fresh-raw-milk",
            "description": "Raw milk from free-grazing indigenous Gir cows. Naturally rich in pure A2 beta-casein.",
            "images": ["https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800"],
            "price": 85.0,
            "unit": "litre",
            "stock_qty": 40,
            "is_organic": True,
            "badges": ["A2 Protein"],
            "rating_avg": 4.98,
            "rating_count": 110,
            "status": "active",
            "created_at": datetime.utcnow()
        },
        {
            "farmer_id": r_profile.inserted_id,
            "category_id": cat_map["grains"],
            "title": "Royal Himalayan Organic Basmati Rice",
            "slug": "royal-himalayan-organic-basmati-rice",
            "description": "Naturally aged 2 years for slender long grains and exquisite fragrance.",
            "images": ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"],
            "price": 195.0,
            "unit": "kg",
            "stock_qty": 180,
            "is_organic": True,
            "badges": ["2-Year Aged"],
            "rating_avg": 4.92,
            "rating_count": 73,
            "status": "active",
            "created_at": datetime.utcnow()
        }
    ]
    await db.products.insert_many(sample_products)
    
    print("Database seeding completed successfully!")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed())
