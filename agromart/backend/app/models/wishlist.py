from typing import List
from pydantic import BaseModel
from app.models.product import ProductResponse

class WishlistResponse(BaseModel):
    id: str
    user_id: str
    product_ids: List[str] = []
    products: List[ProductResponse] = []
