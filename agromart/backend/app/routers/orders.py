from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.core.deps import get_db, get_current_user, require_role
from app.models.order import OrderResponse, OrderItemSnapshot, AddressSnapshot, OrderStatusUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])

def format_order_response(o: dict) -> OrderResponse:
    return OrderResponse(
        id=str(o["_id"]),
        order_number=o["order_number"],
        user_id=str(o["user_id"]),
        items=[OrderItemSnapshot(**i) for i in o.get("items", [])],
        address=AddressSnapshot(**o["address"]),
        subtotal=o.get("subtotal", 0.0),
        gst=o.get("gst", 0.0),
        delivery_fee=o.get("delivery_fee", 0.0),
        discount=o.get("discount", 0.0),
        total=o.get("total", 0.0),
        payment_status=o.get("payment_status", "pending"),
        order_status=o.get("order_status", "placed"),
        payment_method=o.get("payment_method", "razorpay"),
        razorpay_order_id=o.get("razorpay_order_id"),
        razorpay_payment_id=o.get("razorpay_payment_id"),
        created_at=o.get("created_at")
    )

@router.get("", response_model=List[OrderResponse])
async def list_user_orders(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    cursor = db.orders.find({"user_id": ObjectId(current_user["id"])}).sort("created_at", -1)
    orders = await cursor.to_list(length=100)
    return [format_order_response(o) for o in orders]

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_detail(order_id: str, current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order_id")
        
    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    # User can view own order, or farmer/admin can view
    user_role = current_user.get("role", "customer")
    if str(order["user_id"]) != current_user["id"] and user_role not in ["farmer", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
        
    return format_order_response(order)

@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status_in: OrderStatusUpdate,
    db=Depends(get_db),
    current_user: dict = Depends(require_role(["farmer", "admin"]))
):
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order_id")
        
    res = await db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"order_status": status_in.order_status}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    return format_order_response(order)
