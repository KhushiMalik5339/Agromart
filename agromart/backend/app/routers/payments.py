import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException, status, Depends
from app.core.config import settings
from app.db.mongo import get_database

router = APIRouter(prefix="/payments", tags=["Payments Webhook"])

@router.post("/webhook")
async def razorpay_webhook(request: Request, db=Depends(get_database)):
    payload_body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature")
    
    if not signature:
        raise HTTPException(status_code=400, detail="Missing X-Razorpay-Signature header")
        
    expected_sig = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode('utf-8'),
        payload_body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(expected_sig, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
        
    data = await request.json()
    event = data.get("event")
    
    if event == "payment.captured":
        payment_entity = data["payload"]["payment"]["entity"]
        razorpay_order_id = payment_entity.get("order_id")
        razorpay_payment_id = payment_entity.get("id")
        
        order = await db.orders.find_one({"razorpay_order_id": razorpay_order_id})
        if order:
            await db.orders.update_one(
                {"_id": order["_id"]},
                {"$set": {"payment_status": "paid", "razorpay_payment_id": razorpay_payment_id}}
            )
            
    return {"status": "ok"}
