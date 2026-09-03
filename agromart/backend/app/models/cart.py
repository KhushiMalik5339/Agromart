from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.product import ProductResponse

class CartItemAdd(BaseModel):
    product_id: str
    qty: int = Field(1, ge=1)

class CartItemUpdate(BaseModel):
    qty: int = Field(..., ge=0)

class CartItemResponse(BaseModel):
    product_id: str
    qty: int
    price_snapshot: float
    product: Optional[ProductResponse] = None

class CartResponse(BaseModel):
    id: str
    user_id: str
    items: List[CartItemResponse] = []
    subtotal: float = 0.0
    item_count: int = 0
