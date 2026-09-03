from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.core.deps import get_db, get_current_user
from app.models.review import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("", response_model=List[ReviewResponse])
async def list_product_reviews(product_id: str, db=Depends(get_db)):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product_id")
        
    cursor = db.reviews.find({"product_id": ObjectId(product_id)}).sort("created_at", -1)
    reviews = await cursor.to_list(length=100)
    
    res = []
    for r in reviews:
        user_name = "Anonymous User"
        if r.get("user_id"):
            u = await db.users.find_one({"_id": r["user_id"]})
            if u:
                user_name = u["name"]
                
        res.append(ReviewResponse(
            id=str(r["_id"]),
            product_id=str(r["product_id"]),
            user_id=str(r["user_id"]),
            user_name=user_name,
            rating=r["rating"],
            comment=r["comment"],
            photos=r.get("photos", []),
            verified_purchase=r.get("verified_purchase", True),
            created_at=r.get("created_at")
        ))
    return res

@router.post("", response_model=ReviewResponse)
async def create_review(
    r_in: ReviewCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    if not ObjectId.is_valid(r_in.product_id):
        raise HTTPException(status_code=400, detail="Invalid product_id")
        
    product = await db.products.find_one({"_id": ObjectId(r_in.product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Check if user has purchased this product
    orders = await db.orders.find({
        "user_id": ObjectId(current_user["id"]),
        "payment_status": {"$in": ["paid", "pending_cod"]},
        "items.product_id": r_in.product_id
    }).to_list(length=1)
    
    verified_purchase = len(orders) > 0
    
    doc = {
        "product_id": ObjectId(r_in.product_id),
        "user_id": ObjectId(current_user["id"]),
        "rating": r_in.rating,
        "comment": r_in.comment,
        "photos": r_in.photos,
        "verified_purchase": verified_purchase,
        "created_at": datetime.utcnow()
    }
    
    res = await db.reviews.insert_one(doc)
    doc["_id"] = res.inserted_id
    
    # Recalculate product rating_avg
    all_revs = await db.reviews.find({"product_id": ObjectId(r_in.product_id)}).to_list(length=500)
    avg_rating = sum(r["rating"] for r in all_revs) / float(len(all_revs))
    await db.products.update_one(
        {"_id": ObjectId(r_in.product_id)},
        {"$set": {"rating_avg": round(avg_rating, 1), "rating_count": len(all_revs)}}
    )
    
    return ReviewResponse(
        id=str(doc["_id"]),
        product_id=str(doc["product_id"]),
        user_id=str(doc["user_id"]),
        user_name=current_user["name"],
        rating=doc["rating"],
        comment=doc["comment"],
        photos=doc["photos"],
        verified_purchase=verified_purchase,
        created_at=doc["created_at"]
    )
