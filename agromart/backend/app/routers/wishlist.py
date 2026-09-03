from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.core.deps import get_db, get_current_user
from app.models.wishlist import WishlistResponse
from app.routers.products import format_product_doc

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

async def get_or_create_user_wishlist(user_id: str, db) -> dict:
    wl = await db.wishlists.find_one({"user_id": ObjectId(user_id)})
    if not wl:
        doc = {"user_id": ObjectId(user_id), "product_ids": []}
        res = await db.wishlists.insert_one(doc)
        doc["_id"] = res.inserted_id
        return doc
    return wl

@router.get("", response_model=WishlistResponse)
async def get_wishlist(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    wl = await get_or_create_user_wishlist(current_user["id"], db)
    p_ids = wl.get("product_ids", [])
    
    products = []
    str_pids = []
    for pid in p_ids:
        p_doc = await db.products.find_one({"_id": pid})
        if p_doc:
            products.append(format_product_doc(p_doc))
            str_pids.append(str(pid))
            
    return WishlistResponse(
        id=str(wl["_id"]),
        user_id=str(wl["user_id"]),
        product_ids=str_pids,
        products=products
    )

@router.post("/{product_id}", response_model=WishlistResponse)
async def add_to_wishlist(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product_id")
        
    wl = await get_or_create_user_wishlist(current_user["id"], db)
    pid_obj = ObjectId(product_id)
    
    if pid_obj not in wl.get("product_ids", []):
        await db.wishlists.update_one(
            {"_id": wl["_id"]},
            {"$addToSet": {"product_ids": pid_obj}}
        )
        
    return await get_wishlist(current_user=current_user, db=db)

@router.delete("/{product_id}", response_model=WishlistResponse)
async def remove_from_wishlist(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product_id")
        
    wl = await get_or_create_user_wishlist(current_user["id"], db)
    pid_obj = ObjectId(product_id)
    
    await db.wishlists.update_one(
        {"_id": wl["_id"]},
        {"$pull": {"product_ids": pid_obj}}
    )
    return await get_wishlist(current_user=current_user, db=db)
