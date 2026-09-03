from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class Location(BaseModel):
    address: str
    city: str
    state: str
    lat: Optional[float] = 0.0
    lng: Optional[float] = 0.0

class FarmerProfileCreate(BaseModel):
    farm_name: str = Field(..., min_length=2)
    bio: Optional[str] = None
    location: Location

class FarmerProfileResponse(BaseModel):
    id: str
    user_id: str
    farm_name: str
    bio: Optional[str] = None
    location: Location
    verified: bool = False
    rating_avg: float = 5.0
    created_at: Optional[datetime] = None
