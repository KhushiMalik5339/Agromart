from typing import Optional, List
from pydantic import BaseModel, Field

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=2)
    slug: str
    icon: Optional[str] = "eco"
    parent_id: Optional[str] = None

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    icon: Optional[str] = "eco"
    parent_id: Optional[str] = None
    subcategories: List["CategoryResponse"] = []
