from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from bson import ObjectId
from app.core.deps import get_db, require_role, get_optional_current_user
from app.models.product import ProductCreate, ProductUpdate, ProductResponse, NutritionInfo

router = APIRouter(prefix="/products", tags=["Products"])

def format_product_doc(p: dict, category_name: str = None, farmer_doc: dict = None) -> ProductResponse:
    pid = str(p["_id"])
    farmer_name = "Organic Farmer"
    farm_name = "Green Valley Organic Farm"
    if farmer_doc:
        farm_name = farmer_doc.get("farm_name", farm_name)
    
    return ProductResponse(
        id=pid,
        farmer_id=str(p.get("farmer_id", "")),
        farmer_name=farmer_name,
        farm_name=farm_name,
        title=p["title"],
        slug=p["slug"],
        category_id=str(p["category_id"]),
        category_name=category_name or p.get("category_name", "Organic Produce"),
        description=p.get("description", ""),
        benefits=p.get("benefits", []),
        nutrition=NutritionInfo(**p.get("nutrition", {})),
        images=p.get("images", []),
        video_url=p.get("video_url"),
        price=p["price"],
        unit=p.get("unit", "kg"),
        stock_qty=p.get("stock_qty", 100),
        is_organic=p.get("is_organic", True),
        badges=p.get("badges", []),
        rating_avg=p.get("rating_avg", 4.8),
        rating_count=p.get("rating_count", 12),
        status=p.get("status", "active"),
        created_at=p.get("created_at")
    )

@router.get("", response_model=List[ProductResponse])
async def list_products(
    category: Optional[str] = Query(None, description="Category slug or ID"),
    search: Optional[str] = Query(None, description="Search query"),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    is_organic: Optional[bool] = Query(None),
    min_rating: Optional[float] = Query(None),
    sort: Optional[str] = Query("popular", description="popular | price_low | price_high | newest | rating"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db=Depends(get_db)
):
    query = {}
    
    if category:
        if ObjectId.is_valid(category):
            query["category_id"] = ObjectId(category)
        else:
            cat_doc = await db.categories.find_one({"slug": category})
            if cat_doc:
                query["category_id"] = cat_doc["_id"]
    
    if search:
        query["$text"] = {"$search": search}
        
    if is_organic is not None:
        query["is_organic"] = is_organic
        
    if min_price is not None or max_price is not None:
        price_q = {}
        if min_price is not None:
            price_q["$gte"] = min_price
        if max_price is not None:
            price_q["$lte"] = max_price
        query["price"] = price_q

    if min_rating is not None:
        query["rating_avg"] = {"$gte": min_rating}

    sort_order = [("created_at", -1)]
    if sort == "price_low":
        sort_order = [("price", 1)]
    elif sort == "price_high":
        sort_order = [("price", -1)]
    elif sort == "rating":
        sort_order = [("rating_avg", -1)]
    elif sort == "newest":
        sort_order = [("created_at", -1)]

    skip = (page - 1) * limit
    cursor = db.products.find(query).sort(sort_order).skip(skip).limit(limit)
    products_raw = await cursor.to_list(length=limit)
    
    res = []
    for p in products_raw:
        res.append(format_product_doc(p))
    return res

@router.get("/featured", response_model=List[ProductResponse])
async def get_featured_products(db=Depends(get_db)):
    cursor = db.products.find({"status": "active"}).sort("rating_avg", -1).limit(8)
    products_raw = await cursor.to_list(length=8)
    return [format_product_doc(p) for p in products_raw]

@router.get("/search", response_model=List[ProductResponse])
async def search_products(q: str, db=Depends(get_db)):
    if not q or len(q.strip()) == 0:
        return []
    cursor = db.products.find({"$text": {"$search": q}}).limit(20)
    products_raw = await cursor.to_list(length=20)
    return [format_product_doc(p) for p in products_raw]

@router.get("/{slug_or_id}", response_model=ProductResponse)
async def get_product_detail(slug_or_id: str, db=Depends(get_db)):
    if ObjectId.is_valid(slug_or_id):
        product = await db.products.find_one({"_id": ObjectId(slug_or_id)})
    else:
        product = await db.products.find_one({"slug": slug_or_id})
        
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    cat_name = None
    if product.get("category_id"):
        cat = await db.categories.find_one({"_id": product["category_id"]})
        if cat:
            cat_name = cat["name"]
            
    farmer_doc = None
    if product.get("farmer_id"):
        farmer_doc = await db.farmer_profiles.find_one({"_id": product["farmer_id"]})
        
    return format_product_doc(product, category_name=cat_name, farmer_doc=farmer_doc)

@router.post("", response_model=ProductResponse)
async def create_product(
    prod_in: ProductCreate,
    db=Depends(get_db),
    current_user: dict = Depends(require_role(["farmer", "admin"]))
):
    if not ObjectId.is_valid(prod_in.category_id):
        raise HTTPException(status_code=400, detail="Invalid category_id format")
        
    farmer_profile = await db.farmer_profiles.find_one({"user_id": ObjectId(current_user["id"])})
    farmer_id = farmer_profile["_id"] if farmer_profile else ObjectId(current_user["id"])
    
    slug_base = prod_in.title.lower().replace(" ", "-").replace("/", "-")
    slug = f"{slug_base}-{int(datetime.utcnow().timestamp())}"
    
    doc = {
        "farmer_id": farmer_id,
        "title": prod_in.title,
        "slug": slug,
        "category_id": ObjectId(prod_in.category_id),
        "description": prod_in.description,
        "benefits": prod_in.benefits,
        "nutrition": prod_in.nutrition.model_dump(),
        "images": prod_in.images or ["https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600"],
        "video_url": prod_in.video_url,
        "price": prod_in.price,
        "unit": prod_in.unit,
        "stock_qty": prod_in.stock_qty,
        "is_organic": prod_in.is_organic,
        "badges": prod_in.badges,
        "rating_avg": 5.0,
        "rating_count": 1,
        "status": "active",
        "created_at": datetime.utcnow()
    }
    
    res = await db.products.insert_one(doc)
    doc["_id"] = res.inserted_id
    return format_product_doc(doc)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    prod_in: ProductUpdate,
    db=Depends(get_db),
    current_user: dict = Depends(require_role(["farmer", "admin"]))
):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product_id")
        
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    update_data = {k: v for k, v in prod_in.model_dump(exclude_unset=True).items() if v is not None}
    if "category_id" in update_data and ObjectId.is_valid(update_data["category_id"]):
        update_data["category_id"] = ObjectId(update_data["category_id"])
    if "nutrition" in update_data and hasattr(update_data["nutrition"], "model_dump"):
        update_data["nutrition"] = update_data["nutrition"].model_dump()
        
    if update_data:
        await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
        
    updated_doc = await db.products.find_one({"_id": ObjectId(product_id)})
    return format_product_doc(updated_doc)

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    db=Depends(get_db),
    current_user: dict = Depends(require_role(["farmer", "admin"]))
):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product_id")
    res = await db.products.delete_one({"_id": ObjectId(product_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}
