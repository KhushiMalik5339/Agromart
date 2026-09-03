from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.core.deps import get_db, get_current_user
from app.models.cart import CartItemAdd, CartItemUpdate, CartResponse, CartItemResponse
from app.routers.products import format_product_doc

router = APIRouter(prefix="/cart", tags=["Cart"])

async def get_or_create_user_cart(user_id: str, db) -> dict:
    cart = await db.carts.find_one({"user_id": ObjectId(user_id)})
    if not cart:
        doc = {
            "user_id": ObjectId(user_id),
            "items": [],
            "updated_at": datetime.utcnow()
        }
        res = await db.carts.insert_one(doc)
        doc["_id"] = res.inserted_id
        return doc
    return cart

async def build_cart_response(cart: dict, db) -> CartResponse:
    cid = str(cart["_id"])
    user_id = str(cart["user_id"])
    items_res = []
    subtotal = 0.0
    item_count = 0
    
    for item in cart.get("items", []):
        pid_obj = item["product_id"] if isinstance(item["product_id"], ObjectId) else ObjectId(item["product_id"])
        product_doc = await db.products.find_one({"_id": pid_obj})
        p_res = None
        price = item.get("price_snapshot", 0.0)
        if product_doc:
            p_res = format_product_doc(product_doc)
            price = p_res.price
            
        qty = item.get("qty", 1)
        subtotal += price * qty
        item_count += qty
        
        items_res.append(CartItemResponse(
            product_id=str(pid_obj),
            qty=qty,
            price_snapshot=price,
            product=p_res
        ))
        
    return CartResponse(
        id=cid,
        user_id=user_id,
        items=items_res,
        subtotal=round(subtotal, 2),
        item_count=item_count
    )

@router.get("", response_model=CartResponse)
async def get_cart(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    cart = await get_or_create_user_cart(current_user["id"], db)
    return await build_cart_response(cart, db)

@router.post("/items", response_model=CartResponse)
async def add_to_cart(
    item_in: CartItemAdd,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    if not ObjectId.is_valid(item_in.product_id):
        raise HTTPException(status_code=400, detail="Invalid product_id")
        
    product = await db.products.find_one({"_id": ObjectId(item_in.product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    cart = await get_or_create_user_cart(current_user["id"], db)
    
    items = cart.get("items", [])
    found = False
    for item in items:
        pid_str = str(item["product_id"])
        if pid_str == item_in.product_id:
            item["qty"] += item_in.qty
            item["price_snapshot"] = product["price"]
            found = True
            break
            
    if not found:
        items.append({
            "product_id": ObjectId(item_in.product_id),
            "qty": item_in.qty,
            "price_snapshot": product["price"]
        })
        
    await db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": items, "updated_at": datetime.utcnow()}}
    )
    
    updated_cart = await db.carts.find_one({"_id": cart["_id"]})
    return await build_cart_response(updated_cart, db)

@router.patch("/items/{product_id}", response_model=CartResponse)
async def update_cart_item(
    product_id: str,
    update_in: CartItemUpdate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    cart = await get_or_create_user_cart(current_user["id"], db)
    items = cart.get("items", [])
    
    new_items = []
    for item in items:
        pid_str = str(item["product_id"])
        if pid_str == product_id:
            if update_in.qty > 0:
                item["qty"] = update_in.qty
                new_items.append(item)
        else:
            new_items.append(item)
            
    await db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": new_items, "updated_at": datetime.utcnow()}}
    )
    
    updated_cart = await db.carts.find_one({"_id": cart["_id"]})
    return await build_cart_response(updated_cart, db)

@router.delete("/items/{product_id}", response_model=CartResponse)
async def remove_cart_item(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    cart = await get_or_create_user_cart(current_user["id"], db)
    items = cart.get("items", [])
    
    new_items = [item for item in items if str(item["product_id"]) != product_id]
    
    await db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": new_items, "updated_at": datetime.utcnow()}}
    )
    
    updated_cart = await db.carts.find_one({"_id": cart["_id"]})
    return await build_cart_response(updated_cart, db)

@router.delete("", response_model=CartResponse)
async def clear_cart(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    cart = await get_or_create_user_cart(current_user["id"], db)
    await db.carts.update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": [], "updated_at": datetime.utcnow()}}
    )
    updated_cart = await db.carts.find_one({"_id": cart["_id"]})
    return await build_cart_response(updated_cart, db)
