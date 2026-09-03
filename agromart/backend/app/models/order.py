from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class OrderItemSnapshot(BaseModel):
    product_id: str
    title: str
    price: float
    qty: int
    unit: str
    image: Optional[str] = None

class AddressSnapshot(BaseModel):
    label: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    pincode: str

class CheckoutCalculateRequest(BaseModel):
    address_id: Optional[str] = None
    coupon_code: Optional[str] = None

class CheckoutCalculateResponse(BaseModel):
    subtotal: float
    gst: float
    delivery_fee: float
    discount: float
    total: float

class CreateOrderRequest(BaseModel):
    address_id: str
    coupon_code: Optional[str] = None
    payment_method: Literal["razorpay", "cod"] = "razorpay"

class OrderStatusUpdate(BaseModel):
    order_status: Literal["placed", "packed", "shipped", "delivered", "cancelled"]

class OrderResponse(BaseModel):
    id: str
    order_number: str
    user_id: str
    items: List[OrderItemSnapshot]
    address: AddressSnapshot
    subtotal: float
    gst: float
    delivery_fee: float
    discount: float
    total: float
    payment_status: str  # "pending", "paid", "failed", "pending_cod"
    order_status: str    # "placed", "packed", "shipped", "delivered", "cancelled"
    payment_method: str
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: Optional[datetime] = None
