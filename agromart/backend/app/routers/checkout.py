import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.core.deps import get_db, get_current_user
from app.models.order import (
    CheckoutCalculateRequest,
    CheckoutCalculateResponse,
    CreateOrderRequest,
    OrderResponse,
    OrderItemSnapshot,
    AddressSnapshot
)
from app.models.payment import VerifyPaymentRequest
from app.integrations.razorpay_client import razorpay_client

router = APIRouter(prefix="/checkout", tags=["Checkout & Payments"])

async def calculate_checkout_amounts(user_id: str, coupon_code: str = None, db = None):
    cart = await db.carts.find_one({"user_id": ObjectId(user_id)})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    subtotal = 0.0
    for item in cart["items"]:
        pid = item["product_id"] if isinstance(item["product_id"], ObjectId) else ObjectId(item["product_id"])
        product = await db.products.find_one({"_id": pid})
        price = product["price"] if product else item.get("price_snapshot", 0.0)
        subtotal += price * item.get("qty", 1)
        
    subtotal = round(subtotal, 2)
    gst = round(subtotal * 0.05, 2)  # 5% GST on organic food
    delivery_fee = 0.0 if subtotal > 499 else 49.0
    
    discount = 0.0
    if coupon_code:
        coupon = await db.coupons.find_one({"code": coupon_code.upper()})
        if coupon:
            if coupon.get("discount_type") == "percent":
                discount = round(subtotal * (coupon.get("value", 0) / 100.0), 2)
            else:
                discount = min(subtotal, coupon.get("value", 0.0))
                
    total = round(max(0.0, subtotal + gst + delivery_fee - discount), 2)
    return {
        "subtotal": subtotal,
        "gst": gst,
        "delivery_fee": delivery_fee,
        "discount": discount,
        "total": total
    }

@router.post("/calculate", response_model=CheckoutCalculateResponse)
async def calculate_checkout(
    req: CheckoutCalculateRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    amounts = await calculate_checkout_amounts(current_user["id"], req.coupon_code, db)
    return CheckoutCalculateResponse(**amounts)

@router.post("/create-order", response_model=OrderResponse)
async def create_order(
    req: CreateOrderRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    user_id = current_user["id"]
    cart = await db.carts.find_one({"user_id": ObjectId(user_id)})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cannot place order with an empty cart")
        
    # Address check
    address_doc = None
    if ObjectId.is_valid(req.address_id):
        address_doc = await db.addresses.find_one({"_id": ObjectId(req.address_id), "user_id": ObjectId(user_id)})
        
    if not address_doc:
        address_doc = {
            "label": "Home",
            "line1": "123 Farm View Colony, Main Road",
            "line2": "Near Green Park",
            "city": "Nashik",
            "state": "Maharashtra",
            "pincode": "422001"
        }
        
    address_snapshot = AddressSnapshot(
        label=address_doc.get("label", "Home"),
        line1=address_doc["line1"],
        line2=address_doc.get("line2"),
        city=address_doc["city"],
        state=address_doc["state"],
        pincode=address_doc["pincode"]
    )
    
    # Calculate totals
    amounts = await calculate_checkout_amounts(user_id, req.coupon_code, db)
    
    # Build order items snapshot
    order_items = []
    for item in cart["items"]:
        pid = item["product_id"] if isinstance(item["product_id"], ObjectId) else ObjectId(item["product_id"])
        product = await db.products.find_one({"_id": pid})
        if product:
            order_items.append(OrderItemSnapshot(
                product_id=str(pid),
                title=product["title"],
                price=product["price"],
                qty=item["qty"],
                unit=product.get("unit", "kg"),
                image=product.get("images", [""])[0] if product.get("images") else None
            ))
            
    order_number = f"AGM-{random.randint(100000, 999999)}"
    
    payment_status = "pending_cod" if req.payment_method == "cod" else "pending"
    order_status = "placed"
    
    razorpay_order_id = None
    if req.payment_method == "razorpay":
        # Amount in paisa
        amount_paisa = int(amounts["total"] * 100)
        rp_order = razorpay_client.create_order(amount_in_paisa=amount_paisa, receipt=order_number)
        razorpay_order_id = rp_order.get("id")
        
    order_doc = {
        "order_number": order_number,
        "user_id": ObjectId(user_id),
        "items": [item.model_dump() for item in order_items],
        "address": address_snapshot.model_dump(),
        "subtotal": amounts["subtotal"],
        "gst": amounts["gst"],
        "delivery_fee": amounts["delivery_fee"],
        "discount": amounts["discount"],
        "total": amounts["total"],
        "payment_status": payment_status,
        "order_status": order_status,
        "payment_method": req.payment_method,
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": None,
        "created_at": datetime.utcnow()
    }
    
    res = await db.orders.insert_one(order_doc)
    order_id = str(res.inserted_id)
    
    # If COD, clear cart immediately and send notification
    if req.payment_method == "cod":
        await db.carts.update_one({"_id": cart["_id"]}, {"$set": {"items": [], "updated_at": datetime.utcnow()}})
        await db.notifications.insert_one({
            "user_id": ObjectId(user_id),
            "type": "order",
            "title": f"Order #{order_number} Placed!",
            "body": f"Your Cash on Delivery order for ₹{amounts['total']} has been successfully placed.",
            "read": False,
            "created_at": datetime.utcnow()
        })
        # Decrement stock
        for item in order_items:
            await db.products.update_one(
                {"_id": ObjectId(item.product_id)},
                {"$inc": {"stock_qty": -item.qty}}
            )

    return OrderResponse(
        id=order_id,
        order_number=order_number,
        user_id=user_id,
        items=order_items,
        address=address_snapshot,
        subtotal=amounts["subtotal"],
        gst=amounts["gst"],
        delivery_fee=amounts["delivery_fee"],
        discount=amounts["discount"],
        total=amounts["total"],
        payment_status=payment_status,
        order_status=order_status,
        payment_method=req.payment_method,
        razorpay_order_id=razorpay_order_id,
        created_at=order_doc["created_at"]
    )

@router.post("/verify-payment", response_model=OrderResponse)
async def verify_payment(
    req: VerifyPaymentRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    if not ObjectId.is_valid(req.order_id):
        raise HTTPException(status_code=400, detail="Invalid order_id")
        
    order = await db.orders.find_one({"_id": ObjectId(req.order_id), "user_id": ObjectId(current_user["id"])})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    is_valid = razorpay_client.verify_payment_signature(
        razorpay_order_id=req.razorpay_order_id,
        razorpay_payment_id=req.razorpay_payment_id,
        razorpay_signature=req.razorpay_signature
    )
    
    if not is_valid:
        await db.orders.update_one({"_id": order["_id"]}, {"$set": {"payment_status": "failed"}})
        raise HTTPException(status_code=400, detail="Invalid payment signature")
        
    # Update order payment status
    await db.orders.update_one(
        {"_id": order["_id"]},
        {"$set": {
            "payment_status": "paid",
            "razorpay_payment_id": req.razorpay_payment_id
        }}
    )
    
    # Insert payment record
    await db.payments.insert_one({
        "order_id": order["_id"],
        "razorpay_order_id": req.razorpay_order_id,
        "razorpay_payment_id": req.razorpay_payment_id,
        "razorpay_signature": req.razorpay_signature,
        "amount": order["total"],
        "status": "captured",
        "method": "razorpay",
        "created_at": datetime.utcnow()
    })
    
    # Clear user cart
    await db.carts.update_one({"user_id": ObjectId(current_user["id"])}, {"$set": {"items": [], "updated_at": datetime.utcnow()}})
    
    # Decrement stock and notify
    for item in order["items"]:
        await db.products.update_one(
            {"_id": ObjectId(item["product_id"])},
            {"$inc": {"stock_qty": -item["qty"]}}
        )
        
    await db.notifications.insert_one({
        "user_id": ObjectId(current_user["id"]),
        "type": "payment",
        "title": f"Payment Verified for Order #{order['order_number']}",
        "body": f"Payment of ₹{order['total']} confirmed via Razorpay.",
        "read": False,
        "created_at": datetime.utcnow()
    })
    
    updated_order = await db.orders.find_one({"_id": order["_id"]})
    return OrderResponse(
        id=str(updated_order["_id"]),
        order_number=updated_order["order_number"],
        user_id=str(updated_order["user_id"]),
        items=[OrderItemSnapshot(**item) for item in updated_order["items"]],
        address=AddressSnapshot(**updated_order["address"]),
        subtotal=updated_order["subtotal"],
        gst=updated_order["gst"],
        delivery_fee=updated_order["delivery_fee"],
        discount=updated_order["discount"],
        total=updated_order["total"],
        payment_status="paid",
        order_status=updated_order["order_status"],
        payment_method=updated_order["payment_method"],
        razorpay_order_id=updated_order.get("razorpay_order_id"),
        razorpay_payment_id=req.razorpay_payment_id,
        created_at=updated_order.get("created_at")
    )
