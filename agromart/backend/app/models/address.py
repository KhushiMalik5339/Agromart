from typing import Optional
from pydantic import BaseModel, Field

class AddressCreate(BaseModel):
    label: str = "Home"
    line1: str = Field(..., min_length=3)
    line2: Optional[str] = None
    city: str
    state: str
    pincode: str = Field(..., min_length=6, max_length=6)
    is_default: bool = False

class AddressResponse(BaseModel):
    id: str
    user_id: str
    label: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    is_default: bool
