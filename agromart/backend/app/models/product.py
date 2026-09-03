from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class NutritionInfo(BaseModel):
    calories: Optional[str] = "0 kcal"
    protein: Optional[str] = "0g"
    carbs: Optional[str] = "0g"
    fats: Optional[str] = "0g"

class ProductCreate(BaseModel):
    title: str = Field(..., min_length=2)
    category_id: str
    description: str
    benefits: List[str] = []
    nutrition: NutritionInfo = NutritionInfo()
    images: List[str] = []
    video_url: Optional[str] = None
    price: float = Field(..., gt=0)
    unit: str = "kg"
    stock_qty: int = Field(0, ge=0)
    is_organic: bool = True
    badges: List[str] = ["Fresh Harvest"]

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    benefits: Optional[List[str]] = None
    nutrition: Optional[NutritionInfo] = None
    images: Optional[List[str]] = None
    video_url: Optional[str] = None
    price: Optional[float] = None
    unit: Optional[str] = None
    stock_qty: Optional[int] = None
    is_organic: Optional[bool] = None
    badges: Optional[List[str]] = None
    status: Optional[str] = None

class ProductResponse(BaseModel):
    id: str
    farmer_id: str
    farmer_name: Optional[str] = "Organic Farmer"
    farm_name: Optional[str] = "Green Valley Organic Farm"
    title: str
    slug: str
    category_id: str
    category_name: Optional[str] = None
    description: str
    benefits: List[str] = []
    nutrition: NutritionInfo
    images: List[str] = []
    video_url: Optional[str] = None
    price: float
    unit: str
    stock_qty: int
    is_organic: bool
    badges: List[str] = []
    rating_avg: float = 4.8
    rating_count: int = 12
    status: str = "active"
    created_at: Optional[datetime] = None
