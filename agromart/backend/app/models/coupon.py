from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field

class CouponCreate(BaseModel):
    code: str = Field(..., min_length=3)
    discount_type: Literal["flat", "percent"] = "percent"
    value: float = Field(..., gt=0)
    min_order_value: float = 0.0
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    usage_limit: int = 100

class CouponResponse(BaseModel):
    id: str
    code: str
    discount_type: str
    value: float
    min_order_value: float
    usage_limit: int
    used_count: int
