from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class VerifyPaymentRequest(BaseModel):
    order_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PaymentResponse(BaseModel):
    id: str
    order_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    amount: float
    status: str
    method: str
    created_at: Optional[datetime] = None
