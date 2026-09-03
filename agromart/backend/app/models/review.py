from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    product_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=3)
    photos: List[str] = []

class ReviewResponse(BaseModel):
    id: str
    product_id: str
    user_id: str
    user_name: str = "Anonymous User"
    rating: int
    comment: str
    photos: List[str] = []
    verified_purchase: bool = True
    created_at: Optional[datetime] = None
